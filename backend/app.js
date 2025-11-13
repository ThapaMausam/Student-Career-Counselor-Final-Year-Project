import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import modelManager from "./ml/modelManager.js";
import { connectDb } from "./db.js";
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: true, // Allow all origins
    credentials: true, // Allow credentials (cookies)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);
app.use(express.json());
app.use(cookieParser());

// Initialize model manager on startup
let isInitialized = false;

const initializeApp = async () => {
  try {
    if (!isInitialized) {
      await modelManager.initialize();
      isInitialized = true;
      console.log("Application initialized successfully");
    }
  } catch (error) {
    console.error("Failed to initialize application:", error);
  }
};

// Initialize on startup
// connect to DB first (best-effort) then initialize
connectDb()
  .then(() => initializeApp())
  .catch((err) => {
    console.warn("DB connection failed (continuing startup):", err.message);
    // still attempt model manager initialization (in-memory) if needed
    initializeApp();
  });

// --- Authentication helpers and routes ---

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret_for_prod";
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || "7d";

function signToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
  });
}

function authMiddleware(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token)
      return res.status(401).json({ success: false, error: "Unauthorized" });
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, error: "Invalid or expired token" });
  }
}

// Register (signup) - only basic info
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password, userType, profile } = req.body;
    if (!email || !password || !userType) {
      return res.status(400).json({
        success: false,
        error: "Email, password, and userType are required",
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, error: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    // Only save basic profile info (username, email, phone)
    const basicProfile = profile
      ? {
          username: profile.username || profile.fullName || "",
          email: profile.email || email,
          phone: profile.phone || "",
        }
      : { email, username: "", phone: "" };

    const user = await User.create({
      email,
      passwordHash,
      userType,
      profile: basicProfile,
      modelRegistration: { completed: false, attributes: null },
    });
    const token = signToken(user);

    // set httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        userType: user.userType,
        modelRegistration: user.modelRegistration,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, error: "Failed to register" });
  }
});

// Keep register endpoint for backward compatibility
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, userType, profile } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, error: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const basicProfile = profile
      ? {
          username: profile.username || profile.fullName || "",
          email: profile.email || email,
          phone: profile.phone || "",
        }
      : { email, username: "", phone: "" };

    const user = await User.create({
      email,
      passwordHash,
      userType,
      profile: basicProfile,
      modelRegistration: { completed: false, attributes: null },
    });
    const token = signToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.json({
      success: true,
      user: { id: user._id, email: user.email, userType: user.userType },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, error: "Failed to register" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, error: "Email and password required" });
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok)
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });

    const token = signToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        userType: user.userType,
        modelRegistration: user.modelRegistration,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, error: "Login failed" });
  }
});

// Logout
app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true });
});

// Current user
app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    console.error("me error", err);
    res.status(500).json({ success: false, error: "Failed to fetch user" });
  }
});

// Get user's recommendations
app.get("/api/user/recommendations", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("recommendations");
    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });
    res.json({ success: true, recommendations: user.recommendations || [] });
  } catch (err) {
    console.error("get recommendations error", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch recommendations" });
  }
});

// Save a recommendation for the logged-in user
app.post("/api/user/recommendations", authMiddleware, async (req, res) => {
  try {
    const { datasetName, prediction, studentProfile } = req.body;
    if (!datasetName || !prediction)
      return res
        .status(400)
        .json({ success: false, error: "datasetName and prediction required" });
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });

    // Ensure we save the raw student data directly
    const rawStudentData = studentProfile.raw || studentProfile;

    // Format the recommendation data with the same structure used in the /recommendations endpoint
    const recommendationToSave = {
      datasetName,
      model: datasetName,
      prediction,
      studentProfile: rawStudentData, // Save the raw data directly
    };

    user.recommendations.push(recommendationToSave);
    await user.save();
    res.json({
      success: true,
      recommendation: recommendationToSave,
    });
  } catch (err) {
    console.error("save recommendation error", err);
    res
      .status(500)
      .json({ success: false, error: "Failed to save recommendation" });
  }
});

// Get model registration info
app.get("/api/user/modelRegistration", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "modelRegistration userType"
    );
    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });
    res.json({
      success: true,
      modelRegistration: user.modelRegistration || {
        completed: false,
        attributes: null,
      },
      userType: user.userType,
    });
  } catch (err) {
    console.error("get modelRegistration error", err);
    res
      .status(500)
      .json({
        success: false,
        error: "Failed to fetch model registration",
      });
  }
});

// Save or update model registration
app.post("/api/user/modelRegistration", authMiddleware, async (req, res) => {
  try {
    const { attributes } = req.body;
    if (!attributes || typeof attributes !== "object") {
      return res.status(400).json({
        success: false,
        error: "Model attributes are required and must be an object",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });

    // Validate that attributes match userType requirements
    if (user.userType) {
      const validation = modelManager.validateStudentData(
        attributes,
        user.userType
      );
      if (!validation.valid) {
        const errorMessage = validation.missingAttributes
          ? `Missing required fields: ${validation.missingAttributes.join(", ")}`
          : validation.invalidAttributes
          ? `Invalid values for: ${validation.invalidAttributes.map((a) => a.attribute).join(", ")}`
          : "Invalid model attributes";
        return res.status(400).json({
          success: false,
          error: errorMessage,
          details: validation,
        });
      }
    }

    // Update model registration
    user.modelRegistration = {
      completed: true,
      attributes: attributes,
    };

    await user.save();

    res.json({
      success: true,
      modelRegistration: user.modelRegistration,
    });
  } catch (err) {
    console.error("save modelRegistration error", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to save model registration",
    });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    initialized: isInitialized,
    timestamp: new Date().toISOString(),
  });
});

// Get available datasets
app.get("/api/datasets", async (req, res) => {
  try {
    if (!isInitialized) {
      await initializeApp();
    }

    const datasets = modelManager.getAvailableDatasets();
    res.json({ success: true, datasets });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to get datasets",
      message: error.message,
    });
  }
});

// Get model statistics
// Model statistics endpoint disabled for defense build
app.get("/api/model-stats/:datasetName", async (req, res) => {
  res.status(404).json({
    success: false,
    error: "Model statistics endpoint has been disabled in this build",
  });
});

// Get recommendations endpoint
app.post("/api/recommendations", async (req, res) => {
  try {
    if (!isInitialized) {
      await initializeApp();
    }

    const { studentData, datasetName = "see" } = req.body;

    if (!studentData) {
      return res.status(400).json({
        success: false,
        error: "Student data is required",
      });
    }

    // Validate student data
    const validation = modelManager.validateStudentData(
      studentData,
      datasetName
    );
    if (!validation.valid) {
      // Return more detailed error message
      const errorMessage = validation.missingAttributes
        ? `Missing required fields: ${validation.missingAttributes.join(", ")}`
        : validation.invalidAttributes
        ? `Invalid values for: ${validation.invalidAttributes.map((a) => a.attribute).join(", ")}`
        : "Invalid student data";
      return res.status(400).json({
        success: false,
        error: errorMessage,
        details: validation,
      });
    }

    // Get prediction from model manager (uses real ID3 algorithm)
    const result = await modelManager.getPrediction(datasetName, studentData);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: "Failed to generate recommendations",
        message: result.error,
      });
    }

    // Format a generic response that includes the raw student data and
    // dataset-specific friendly fields for frontend display.
    const studentProfile = { raw: studentData };

    if (datasetName === "see") {
      studentProfile.academicPerformance = {
        seeGpa: studentData.SEE_GPA,
        seeScienceGpa: studentData.SEE_Science_GPA,
        seeMathGpa: studentData.SEE_Math_GPA,
      };
      studentProfile.preferences = {
        fee: studentData.Fee,
        hostel: studentData.Hostel,
        transportation: studentData.Transportation,
        eca: studentData.ECA,
        scholarship: studentData.Scholarship,
      };
      studentProfile.facilities = {
        scienceLabs: studentData.Science_Labs,
        infrastructure: studentData.Infrastructure,
      };
      studentProfile.location = studentData.College_Location || null;
    } else if (datasetName === "plusTwo") {
      studentProfile.academic = {
        overallGpa: studentData.Overall_GPA,
        faculty: studentData.Faculty,
        program: studentData.Program,
      };
      studentProfile.preferences = {
        fee: studentData.Fee,
        scholarship: studentData.Scholarship,
        labSpecialization: studentData.Lab_Specialization,
        admissionCompetitiveness: studentData.Admission_Competitiveness,
      };
    } else if (datasetName === "bachelor") {
      studentProfile.academic = {
        currentStatus: studentData.Current_Status,
        academicYear: studentData.Academic_Year,
        stream: studentData.Academic_Stream,
      };
      studentProfile.performance = {
        grade: studentData.Performance,
        projectDomain: studentData.Project_Domain,
        internship: studentData.Internship,
      };
      studentProfile.preferences = {
        learningMethod: studentData.Learning_Method,
        careerGoal: studentData.Career_Goal,
        availability: studentData.Availability,
      };
    }

    res.json({
      success: true,
      recommendations: {
        college: result.prediction.college,
        model: result.model,
      },
      studentProfile,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in recommendations endpoint:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message,
    });
  }
});

// Get model evaluation results
// Evaluation endpoint disabled for defense build
app.get("/api/evaluate/:datasetName", async (req, res) => {
  res.status(404).json({
    success: false,
    error: "Evaluation endpoint has been disabled in this build",
  });
});

// Get comprehensive model information (stats + evaluation)
app.get("/api/model-info/:datasetName", async (req, res) => {
  try {
    if (!isInitialized) {
      await initializeApp();
    }

    const { datasetName } = req.params;

    const stats = modelManager.getModelStats(datasetName);
    const evaluation = modelManager.evaluateModel(datasetName);

    if (!stats) {
      return res.status(404).json({
        success: false,
        error: `Model not found for dataset: ${datasetName}`,
      });
    }

    res.json({
      success: true,
      modelInfo: {
        stats,
        evaluation,
      },
    });
  } catch (error) {
    console.error("Error in model-info endpoint:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      message: error.message,
    });
  }
});

// Get training data for a dataset
// Training data endpoint disabled for defense build
app.get("/api/training-data/:datasetName", async (req, res) => {
  res.status(404).json({
    success: false,
    error: "Training data endpoint has been disabled in this build",
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});

export default app;
