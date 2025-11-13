import { useState } from "react";
import { useLanguage } from "../hooks/useLanguage";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";

const Register = ({ language, setLanguage }) => {
  const { t } = useLanguage(language, setLanguage);
  const { userType } = useParams();
  const navigate = useNavigate();
  const { loadAllData } = useApp();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const userTypeLabels = {
    see: language === "en" ? "SEE Student" : "SEE विद्यार्थी",
    plusTwo: language === "en" ? "+2 Graduate" : "+२ पास आउट",
    bachelor: language === "en" ? "Bachelor's Graduate" : "स्नातक पास आउट",
  };

  const handleInputChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName?.trim()) {
      newErrors.fullName =
        language === "en" ? "Full name is required" : "पूरा नाम आवश्यक छ";
    } else if (
      !/^([A-Za-z 0-9'’`\-.]+\s+){1,}[A-Za-z 0-9'’`\-.]+$/.test(
        formData.fullName
      )
    ) {
      newErrors.fullName =
        language === "en"
          ? "Please enter your full name"
          : "कृपया पूरा नाम लेख्नुहोस्";
    }

    if (!formData.email?.trim()) {
      newErrors.email =
        language === "en" ? "Email is required" : "इमेल आवश्यक छ";
    } else {
      const emailRe = /^\S+@\S+\.[A-Za-z]{2,}$/;
      if (!emailRe.test(formData.email)) {
        newErrors.email =
          language === "en"
            ? "Enter a valid email"
            : "मान्य इमेल लेख्नुहोस्";
      }
    }

    if (!formData.phone?.trim()) {
      newErrors.phone =
        language === "en" ? "Phone number is required" : "फोन नम्बर आवश्यक छ";
    } else {
      const ntcPattern = /^(984|985|986)\d{7}$/;
      const ncellPattern = /^(980|981|982)\d{7}$/;
      const phoneNumber = formData.phone.replace(/\D/g, "");
      if (!ntcPattern.test(phoneNumber) && !ncellPattern.test(phoneNumber)) {
        newErrors.phone =
          language === "en"
            ? "Enter a valid NTC (984/985/986) or Ncell (980/981/982) number"
            : "मान्य NTC (९८४/९८५/९८६) वा Ncell (९८०/९८१/९८२) नम्बर लेख्नुहोस्";
      }
    }

    if (!formData.password?.trim()) {
      newErrors.password =
        language === "en" ? "Password is required" : "पासवर्ड आवश्यक छ";
    } else if (formData.password.length < 6) {
      newErrors.password =
        language === "en"
          ? "Password must be at least 6 characters"
          : "पासवर्ड कम्तिमा ६ वर्णको हुनुपर्छ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          userType: userType,
          profile: {
            username: formData.fullName,
            email: formData.email,
            phone: formData.phone,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      if (data.success) {
        // Load all data (user, modelRegistration, recommendations) immediately
        await loadAllData();
        // Redirect to model registration
        navigate("/model-registration");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({
        submit: error.message || "Registration failed",
      });
    } finally {
      setLoading(false);
    }
  };

  if (userType !== "see" && userType !== "plusTwo" && userType !== "bachelor") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {language === "en" ? "Coming Soon!" : "छिट्टै आउँदै!"}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === "en"
              ? `Registration for ${userTypeLabels[userType]} is currently under development. Please check back soon!`
              : `${userTypeLabels[userType]} का लागि दर्ता हाल विकासमा छ। कृपया छिट्टै फेरि जाँच गर्नुहोस्!`}
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {language === "en" ? "Back to Home" : "गृहपृष्ठमा फर्कनुहोस्"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {language === "en" ? "Sign Up as" : "दर्ता गर्नुहोस्"}{" "}
            {userTypeLabels[userType]}
          </h1>
          <p className="text-lg text-gray-600">
            {language === "en"
              ? "Create your account to get started"
              : "सुरु गर्न तपाईंको खाता सिर्जना गर्नुहोस्"}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === "en" ? "Full Name" : "पुरा नाम"}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={
                  language === "en"
                    ? "Enter your full name"
                    : "पूरा नाम प्रविष्ट गर्नुहोस्"
                }
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === "en" ? "Email" : "इमेल"}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={
                  language === "en"
                    ? "Enter your email"
                    : "इमेल प्रविष्ट गर्नुहोस्"
                }
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === "en" ? "Phone Number" : "फोन नम्बर"}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={
                  language === "en"
                    ? "Enter your phone number"
                    : "फोन नम्बर प्रविष्ट गर्नुहोस्"
                }
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {language === "en" ? "Password" : "पासवर्ड"}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={
                  language === "en"
                    ? "Enter your password"
                    : "पासवर्ड प्रविष्ट गर्नुहोस्"
                }
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 font-medium"
            >
              {loading
                ? language === "en"
                  ? "Creating Account..."
                  : "खाता सिर्जना गर्दै..."
                : language === "en"
                ? "Create Account"
                : "खाता सिर्जना गर्नुहोस्"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {language === "en" ? "Already have an account?" : "पहिले नै खाता छ?"}{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {language === "en" ? "Login" : "लगइन"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
