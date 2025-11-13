import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the ID3 algorithm functions from id3.js
import { buildID3Tree, classify, predict } from "./id3.js";

class ModelManager {
  constructor() {
    this.models = new Map();
    this.trainingData = new Map();
    this.testData = new Map();
    this.modelCache = new Map();
  }

  /**
   * Get models map (for external access)
   */
  get modelsMap() {
    return this.models;
  }

  /**
   * Splits the provided array of data into training and test sets using an 80/20 split (default testRatio=0.2).
   * The data is shuffled randomly first to ensure random sampling for both sets. This randomization
   * helps avoid order-based biases (e.g., by input file order). The split is deterministic for a given
   * source (Math.random-based shuffle) but non-reproducible across runs unless a seeded RNG is used.
   *
   * @param {Array} data - Array of full dataset objects/rows
   * @param {number} [testRatio=0.2] - Fraction of data allocated to the test set (rest used for training)
   * @returns {{trainData: Array, testData: Array}} Object with training data (80%) and test data (20%)
   */
  splitData(data, testRatio = 0.2) {
    // Shuffle the data randomly
    const shuffled = [...data].sort(() => Math.random() - 0.5);

    const testSize = Math.floor(data.length * testRatio);
    const testData = shuffled.slice(0, testSize);
    const trainData = shuffled.slice(testSize);

    return { trainData, testData };
  }

  /**
   * Load training data from JSON files in the trainingDataSets directory
   */
  async loadTrainingData() {
    try {
      const trainingDataDir = path.join(__dirname, "../trainingDataSets");

      // Recursively walk trainingDataDir and find all .json files (allows subfolders)
      const walk = (dir) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        const files = [];
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            files.push(...walk(fullPath));
          } else if (entry.isFile() && entry.name.endsWith(".json")) {
            files.push(fullPath);
          }
        }
        return files;
      };

      const jsonFiles = walk(trainingDataDir);

      if (jsonFiles.length === 0) {
        console.warn("No JSON training files found in", trainingDataDir);
      }

      // Helper to normalize filenames to the frontend dataset keys (see, plusTwo, bachelor)
      const normalizeDatasetName = (filename) => {
        const base = path.basename(filename).toLowerCase();
        if (base.includes("see")) return "see";
        if (
          base.includes("plus") ||
          base.includes("plus_two") ||
          base.includes("plus-two") ||
          base.includes("plus_two_college")
        )
          return "plusTwo";
        if (base.includes("bachelor") || base.includes("bachelor_job"))
          return "bachelor";
        // Fallback: use filename without extension
        return path.basename(filename).replace(".json", "");
      };

      for (const filePath of jsonFiles) {
        try {
          const raw = fs.readFileSync(filePath, "utf8");
          const data = JSON.parse(raw);
          const datasetKey = normalizeDatasetName(filePath);

          // Use the entire dataset as training data (no train/test split)
          const trainData = data;
          const testData = [];

          this.trainingData.set(datasetKey, trainData);
          this.testData.set(datasetKey, testData);

          console.log(
            `Loaded ${data.length} records from ${filePath} as dataset '${datasetKey}'`
          );
          console.log(
            `  - Using full dataset as training: ${trainData.length} records (no train/test split)`
          );
        } catch (err) {
          console.error(
            "Failed to read/parse training file",
            filePath,
            err.message
          );
        }
      }
    } catch (error) {
      console.error("Error loading training data:", error);
      throw error;
    }
  }

  /**
   * Build and cache ID3 models for different datasets
   */
  async buildModels() {
    try {
      for (const [datasetName, data] of this.trainingData) {
        console.log(`Building model for ${datasetName} dataset...`);

        if (data.length === 0) {
          console.warn(`No training data found for ${datasetName}`);
          continue;
        }

        // Determine the correct target attribute for this dataset.
        // Most datasets use 'College' as the target, but the bachelor dataset
        // uses 'Suggested_Job_Role'. Detect which key exists in the data and
        // choose appropriately. Fallback to 'College' if neither is present.
        const determineTarget = (record) => {
          if (!record || typeof record !== "object") return "College";
          if (Object.prototype.hasOwnProperty.call(record, "College"))
            return "College";
          if (
            Object.prototype.hasOwnProperty.call(record, "Suggested_Job_Role")
          )
            return "Suggested_Job_Role";
          // also handle slight variants
          const keys = Object.keys(record).map((k) => k.toLowerCase());
          if (
            keys.includes("suggested_job_role") ||
            keys.includes("suggested_job")
          )
            return Object.keys(record).find(
              (k) =>
                k.toLowerCase() === "suggested_job_role" ||
                k.toLowerCase() === "suggested_job"
            );
          // fallback
          return "College";
        };

        const targetAttribute = determineTarget(data[0]);
        const attributes = Object.keys(data[0]).filter(
          (attr) => attr !== targetAttribute && attr !== "Tier"
        );

        // Build the decision tree using training data
        const decisionTree = buildID3Tree(
          data,
          attributes,
          targetAttribute,
          data
        );

        // Store the model
        this.models.set(datasetName, {
          decisionTree,
          attributes,
          targetAttribute,
          data,
          testData: this.testData.get(datasetName),
        });

        console.log(
          `Model built successfully for ${datasetName} with ${attributes.length} attributes`
        );
      }
    } catch (error) {
      console.error("Error building models:", error);
      throw error;
    }
  }

  /**
   * Get prediction for a student using the appropriate model
   */
  async getPrediction(datasetName, studentData) {
    try {
      const model = this.models.get(datasetName);
      if (!model) {
        throw new Error(`Model not found for dataset: ${datasetName}`);
      }

      // Prefer using the pre-built decision tree (built during buildModels) and classify
      // This avoids rebuilding the tree on every prediction and is much faster.
      let predictedCollege = null;
      try {
        if (model.decisionTree) {
          predictedCollege = classify(
            model.decisionTree,
            studentData,
            model.data,
            model.targetAttribute
          );
        }
      } catch (err) {
        console.warn(
          "Classification with prebuilt tree failed, falling back to full predict:",
          err.message
        );
      }

      // Fallback: if classify returned null or no decisionTree present, use predict which will build a tree
      if (!predictedCollege) {
        predictedCollege = predict(
          studentData,
          model.data,
          model.targetAttribute
        );
      }

      return {
        success: true,
        prediction: {
          college: predictedCollege,
        },
        model: datasetName,
      };
    } catch (error) {
      console.error("Error getting prediction:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get available datasets
   */
  getAvailableDatasets() {
    return Array.from(this.trainingData.keys());
  }

  /**
   * Evaluate model performance on test data
   */
  evaluateModel(datasetName) {
    const model = this.models.get(datasetName);
    if (!model || !model.testData) {
      return null;
    }

    const testData = model.testData;
    let correctCollegePredictions = 0;
    let totalPredictions = testData.length;

    const collegeConfusionMatrix = {};

    for (const testRecord of testData) {
      // Get prediction
      const predictedCollege = predict(
        testRecord,
        model.data,
        model.targetAttribute
      );
      const actualCollege = testRecord[model.targetAttribute];

      // Check college prediction
      if (predictedCollege === actualCollege) {
        correctCollegePredictions++;
      }

      // Build confusion matrix
      if (!collegeConfusionMatrix[actualCollege]) {
        collegeConfusionMatrix[actualCollege] = {};
      }
      collegeConfusionMatrix[actualCollege][predictedCollege] =
        (collegeConfusionMatrix[actualCollege][predictedCollege] || 0) + 1;
    }

    const collegeAccuracy =
      (correctCollegePredictions / totalPredictions) * 100;

    return {
      datasetName,
      totalTestRecords: totalPredictions,
      collegeAccuracy: Math.round(collegeAccuracy * 100) / 100,
      collegeConfusionMatrix,
      correctCollegePredictions,
    };
  }

  /**
   * Get model statistics
   */
  getModelStats(datasetName) {
    const model = this.models.get(datasetName);
    if (!model) {
      return null;
    }

    const data = model.data;
    const testData = model.testData;
    const totalTrainRecords = data.length;
    const totalTestRecords = testData ? testData.length : 0;
    const totalPredictions = totalTrainRecords + totalTestRecords;

    // Count records by College in training data
    const collegeCounts = {};

    data.forEach((record) => {
      const college = record[model.targetAttribute];
      collegeCounts[college] = (collegeCounts[college] || 0) + 1;
    });

    // Find most common college
    const topCollege =
      Object.entries(collegeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
      "Unknown";

    // Generate mock monthly trends (in production, track actual predictions over time)
    const monthlyTrends = [
      {
        month: "January",
        predictions: Math.floor(totalPredictions * 0.08),
        accuracy: 93.5,
      },
      {
        month: "February",
        predictions: Math.floor(totalPredictions * 0.09),
        accuracy: 94.2,
      },
      {
        month: "March",
        predictions: Math.floor(totalPredictions * 0.1),
        accuracy: 95.1,
      },
      {
        month: "April",
        predictions: Math.floor(totalPredictions * 0.12),
        accuracy: 94.8,
      },
      {
        month: "May",
        predictions: Math.floor(totalPredictions * 0.11),
        accuracy: 95.5,
      },
      {
        month: "June",
        predictions: Math.floor(totalPredictions * 0.1),
        accuracy: 94.9,
      },
    ];

    // Calculate attribute importance based on information gain (simplified)
    const attributeImportance = model.attributes
      .map((attr) => {
        // Simplified importance calculation - can be enhanced with actual information gain
        const baseImportance = {
          SEE_GPA: 0.95,
          SEE_Science_GPA: 0.82,
          SEE_Math_GPA: 0.78,
          ECA: 0.65,
          Scholarship: 0.58,
          Science_Labs: 0.52,
          Infrastructure: 0.48,
          Fee: 0.42,
          Hostel: 0.35,
          Transportation: 0.28,
          College_Location: 0.25,
        };
        return {
          attribute: attr,
          importance: baseImportance[attr] || 0.2,
        };
      })
      .sort((a, b) => b.importance - a.importance);

    return {
      datasetName,
      totalTrainRecords,
      totalTestRecords,
      totalPredictions,
      collegeDistribution: collegeCounts,
      topCollege,
      monthlyTrends,
      attributeImportance,
      attributes: model.attributes,
    };
  }

  /**
   * Validate student data against model requirements
   */
  validateStudentData(studentData, datasetName) {
    const model = this.models.get(datasetName);
    if (!model) {
      return {
        valid: false,
        error: `Model not found for dataset: ${datasetName}`,
      };
    }

    const requiredAttributes = model.attributes;
    const missingAttributes = [];
    const invalidAttributes = [];

    for (const attr of requiredAttributes) {
      if (!studentData[attr]) {
        missingAttributes.push(attr);
      }
    }

    // Check for valid values based on the dataset using the training data
    const trainingData = model.data;
    if (trainingData && trainingData.length > 0) {
      const validValues = {};

      // Build valid values map from training data
      requiredAttributes.forEach((attr) => {
        const uniqueValues = [
          ...new Set(trainingData.map((record) => record[attr])),
        ];
        validValues[attr] = uniqueValues;
      });

      // Log validation info for debugging
      console.log("Valid values from training data:", validValues);
      console.log("Student data being validated:", studentData);

      for (const [attr, validOptions] of Object.entries(validValues)) {
        if (studentData[attr] && !validOptions.includes(studentData[attr])) {
          console.log(`Invalid value for ${attr}:`, {
            provided: studentData[attr],
            valid: validOptions,
          });
          invalidAttributes.push({
            attribute: attr,
            value: studentData[attr],
            validOptions,
          });
        }
      }
    }

    return {
      valid: missingAttributes.length === 0 && invalidAttributes.length === 0,
      missingAttributes,
      invalidAttributes,
    };
  }

  /**
   * Initialize the model manager
   */
  async initialize() {
    try {
      console.log("Initializing Model Manager...");
      await this.loadTrainingData();
      await this.buildModels();
      console.log("Model Manager initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Model Manager:", error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const modelManager = new ModelManager();

export default modelManager;
