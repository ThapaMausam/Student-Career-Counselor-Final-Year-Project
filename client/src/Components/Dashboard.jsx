import { useEffect } from "react";
import { useLanguage } from "../hooks/useLanguage";
import { useNavigate } from "react-router-dom";
import { Loader2, AlertTriangle, School, Briefcase } from "lucide-react";
import { useApp } from "../contexts/AppContext";

const Dashboard = ({ language, setLanguage }) => {
  const { t } = useLanguage(language, setLanguage);
  const navigate = useNavigate();
  const {
    user,
    modelRegistration,
    recommendations,
    loading,
    loadAllData,
  } = useApp();

  // Refresh data when component mounts or when user changes
  useEffect(() => {
    if (user) {
      loadAllData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Only reload when user ID changes, loadAllData is stable

  const translateValue = (value) => {
    if (language === "en") return value;
    const map = {
      Yes: "हो",
      No: "होइन",
      High: "उच्च",
      Medium: "मध्यम",
      Low: "निम्न",
      Excellent: "उत्कृष्ट",
      Average: "औसत",
      Poor: "खराब",
      "Very Easy": "धेरै सजिलो",
      "Very Hard": "धेरै कठिन",
      "Computer Engineering": "कम्प्युटर इन्जिनियरिङ",
      CSIT: "CSIT",
      BCA: "BCA",
      BIM: "BIM",
      BITM: "BITM",
    };
    return map[value] || value;
  };

  const translateCollege = (college) => {
    if (language === "en") return college;
    const colleges = {
      Trinity: "ट्रिनिटी",
      "St. Xavier's": "सेन्ट जेभियर्स",
      "Thames International": "थेम्स इन्टरनेशनल",
      Pulchowk: "पुल्चोक",
      NEC: "NEC",
    };
    return colleges[college] || college;
  };

  const formatKey = (k) =>
    String(k)
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

  const renderValue = (val) => {
    if (val == null) return "-";
    if (typeof val === "string" || typeof val === "number")
      return translateValue(val);
    if (Array.isArray(val))
      return val.map((v, i) => (
        <span
          key={i}
          className="inline-block bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded-md mr-1 mb-1"
        >
          {translateValue(v)}
        </span>
      ));
    if (typeof val === "object")
      return (
        <div className="space-y-1">
          {Object.entries(val).map(([k, v]) => (
            <div key={k} className="text-sm text-gray-700">
              <strong>{formatKey(k)}:</strong> {translateValue(String(v))}
            </div>
          ))}
        </div>
      );
    return String(val);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600 w-8 h-8 mr-2" />
        <span className="text-gray-600">
          {language === "en"
            ? "Loading your dashboard..."
            : "ड्यासबोर्ड लोड हुँदैछ..."}
        </span>
      </div>
    );

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-600">
        <AlertTriangle className="w-8 h-8 mb-2" />
        <p className="font-medium">
          {language === "en"
            ? "Please login to view your dashboard"
            : "कृपया ड्यासबोर्ड हेर्न लगइन गर्नुहोस्"}
        </p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {language === "en" ? "Go to Login" : "लगइनमा जानुहोस्"}
        </button>
      </div>
    );
  }

  // Check if model registration is completed
  const isModelRegistrationCompleted =
    modelRegistration?.completed === true;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            {language === "en" ? "Dashboard" : "ड्यासबोर्ड"}
          </h1>
          <p className="text-gray-600 text-lg">
            {language === "en"
              ? "Your personalized career counseling dashboard"
              : "तपाईंको व्यक्तिगत करियर परामर्श ड्यासबोर्ड"}
          </p>
        </div>

        {!isModelRegistrationCompleted ? (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {language === "en"
                  ? "Model Registration Incomplete"
                  : "मोडेल दर्ता अपूर्ण"}
              </h2>
              <p className="text-gray-600 mb-6">
                {language === "en"
                  ? "Your model registration is not completed yet. Please complete it to receive personalized recommendations."
                  : "तपाईंको मोडेल दर्ता अहिलेसम्म पूरा भएको छैन। व्यक्तिगत सिफारिसहरू प्राप्त गर्न कृपया यसलाई पूरा गर्नुहोस्।"}
              </p>
              <button
                onClick={() => navigate("/model-registration")}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg font-medium"
              >
                {language === "en"
                  ? "Complete Model Registration"
                  : "मोडेल दर्ता पूरा गर्नुहोस्"}
              </button>
            </div>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <p className="text-gray-600 mb-6">
              {language === "en"
                ? "No saved recommendations yet. Generate your first recommendation now!"
                : "अहिलेसम्म कुनै सिफारिस छैन। अहिले तपाईंको पहिलो सिफारिस उत्पादन गर्नुहोस्!"}
            </p>
            <button
              onClick={() => navigate("/model-registration")}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg font-medium"
            >
              {language === "en"
                ? "Get Recommendations"
                : "सिफारिसहरू प्राप्त गर्नुहोस्"}
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {recommendations.map((rec, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {rec.model === "bachelor" ? (
                      <Briefcase className="text-indigo-600 w-6 h-6" />
                    ) : (
                      <School className="text-indigo-600 w-6 h-6" />
                    )}
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {rec.model === "bachelor"
                        ? translateValue(rec.prediction)
                        : translateCollege(rec.prediction)}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    {rec.timestamp
                      ? new Date(rec.timestamp).toLocaleString(
                          language === "en" ? "en-US" : "ne-NP"
                        )
                      : ""}
                  </p>
                </div>

                {rec.studentProfile && (
                  <div className="border-t pt-4">
                    <h4 className="text-lg font-medium text-gray-800 mb-3">
                      {language === "en" ? "Your Inputs" : "तपाईंका इनपुटहरू"}
                    </h4>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(rec.studentProfile).map(([key, val]) => (
                        <div
                          key={key}
                          className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:bg-gray-100 transition"
                        >
                          <div className="font-medium text-gray-800 text-sm mb-1">
                            {formatKey(key)}
                          </div>
                          <div className="text-gray-700 text-sm">
                            {renderValue(val)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {isModelRegistrationCompleted && recommendations.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/model-registration")}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {language === "en"
                ? "Retry Recommendation"
                : "सिफारिस फेरि प्रयास गर्नुहोस्"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
