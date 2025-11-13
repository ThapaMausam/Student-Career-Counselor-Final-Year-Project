// DataViewer page has been intentionally disabled for the defense build.
// Leaving a lightweight placeholder instead of exposing training data.
import React from "react";

const DataViewer = ({ language }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl text-center">
        <h1 className="text-2xl font-bold mb-4">
          {language === "en" ? "Page Disabled" : "पृष्ठ निष्क्रिय गरिएको"}
        </h1>
        <p className="text-gray-600">
          {language === "en"
            ? "The Training Data Viewer has been removed from this build for privacy/defense reasons."
            : "गोपनीयता/डिफेन्स कारणले यो बिल्डमा प्रशिक्षण डेटा दर्शक हटाइएको छ।"}
        </p>
      </div>
    </div>
  );
};

export default DataViewer;
