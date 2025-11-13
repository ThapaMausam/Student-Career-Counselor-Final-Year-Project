import { useState, useEffect } from "react";
import { useLanguage, toNepaliNumber } from "../hooks/useLanguage";
import { useNavigate } from "react-router-dom";
import { useApp } from "../contexts/AppContext";

const ModelRegistration = ({ language, setLanguage }) => {
  const { t } = useLanguage(language, setLanguage);
  const navigate = useNavigate();
  const { user, modelRegistration: contextModelRegistration, loadAllData } = useApp();

  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [errors, setErrors] = useState({});
  const [userType, setUserType] = useState(null);

  // Load user's model registration data
  useEffect(() => {
    if (user) {
      setUserType(user.userType);
      // Pre-fill form with existing attributes if available
      if (contextModelRegistration?.attributes) {
        // Normalize old values to new format for display
        const normalizedAttributes = { ...contextModelRegistration.attributes };
        
        if (user.userType === "bachelor") {
          // Normalize Learning_Method (convert old underscore format to space format)
          if (normalizedAttributes.Learning_Method === "Real_Project") {
            normalizedAttributes.Learning_Method = "Real Project";
          } else if (normalizedAttributes.Learning_Method === "Self_Learning") {
            normalizedAttributes.Learning_Method = "Self Learning";
          } else if (normalizedAttributes.Learning_Method === "University_Courses") {
            normalizedAttributes.Learning_Method = "University Course";
          }
          
          // Normalize Academic_Year (convert old underscore format to space format)
          if (normalizedAttributes.Academic_Year === "Pre_Final") {
            normalizedAttributes.Academic_Year = "Pre Final";
          }
          
          // Normalize Career_Goal (convert old format to space format)
          if (normalizedAttributes.Career_Goal === "Freelancing") {
            normalizedAttributes.Career_Goal = "Free Lancing";
          }
        }
        
        setFormData(normalizedAttributes);
      }
      setLoadingData(false);
    } else {
      setLoadingData(false);
    }
  }, [user, contextModelRegistration]);

  const userTypeLabels = {
    see: language === "en" ? "SEE Student" : "SEE विद्यार्थी",
    plusTwo: language === "en" ? "+2 Graduate" : "+२ पास आउट",
    bachelor: language === "en" ? "Bachelor's Graduate" : "स्नातक पास आउट",
  };

  // Translation helper functions
  const translateValue = (value) => {
    if (language === "en") return value;
    const valueTranslations = {
      Yes: "हो",
      No: "होइन",
      High: "उच्च",
      Medium: "मध्यम",
      Low: "निम्न",
      Good: "राम्रो",
      Poor: "खराब",
      Excellent: "उत्कृष्ट",
      Average: "औसत",
      Strong: "बलियो",
      Weak: "कमजोर",
      Easy: "सजिलो",
      "Very Easy": "धेरै सजिलो",
      Hard: "कठिन",
      "Very Hard": "धेरै कठिन",
      Mid: "मध्यम",
      "Computer Engineering": "कम्प्युटर इन्जिनियरिङ",
      CSIT: "CSIT",
      BCA: "BCA",
      BITM: "BITM",
      BIM: "BIM",
      "Real Project": "वास्तविक प्रोजेक्टहरू",
      Real_Project: "वास्तविक प्रोजेक्टहरू", // Legacy support
      Bootcamp: "बुटक्याम्प",
      "Self Learning": "स्व-सिकाई",
      Self_Learning: "स्व-सिकाई", // Legacy support
      "University Course": "विश्वविद्यालय पाठ्यक्रमहरू",
      University_Courses: "विश्वविद्यालय पाठ्यक्रमहरू", // Legacy support
      Advanced_Engineering: "उन्नत इन्जिनियरिङ",
      General_CS: "सामान्य कम्प्युटर विज्ञान",
      Basic_CS: "आधारभूत कम्प्युटर विज्ञान",
      None: "कुनै पनि होइन",
      "Full Time": "पूर्णकालीन",
      "Part Time": "आंशिक समय",
      Corporate_Job: "कर्पोरेट जागिर",
      Startup_Company: "स्टार्टअप कम्पनी",
      "Corporate Job": "कर्पोरेट जागिर",
      "Startup Company": "स्टार्टअप कम्पनी",
      "BE Computer": "बि.ई कम्प्युटर",
      "Free Lancing": "फ्रिलान्सिङ",
      Freelancing: "फ्रिलान्सिङ", // Legacy support
      Undecided: "अनिर्णित",
      Web: "वेब विकास",
      Mobile: "मोबाइल विकास",
      Data_Science: "डाटा साइन्स",
      Networking: "नेटवर्किङ",
      UI_UX: "यूआई/यूएक्स",
      Graduate: "स्नातक",
      Undergraduate: "स्नातक नभएको",
      Final: "अन्तिम वर्ष",
      "Pre Final": "अन्तिम वर्ष अघि",
      Pre_Final: "अन्तिम वर्ष अघि", // Legacy support
      Early: "सुरुवाती वर्षहरू",
    };
    return valueTranslations[value] || value;
  };

  // Form steps configuration - Model-specific fields only (no basic info)
  const formSteps = {
    bachelor: [
      {
        step: 1,
        title: language === "en" ? "Academic Background" : "शैक्षिक पृष्ठभूमि",
        fields: [
          {
            name: "Current_Status",
            label: language === "en" ? "Current Status" : "हालको स्थिति",
            type: "select",
            required: true,
            options: [
              {
                value: "Graduate",
                label: language === "en" ? "Graduate" : "स्नातक",
              },
              {
                value: "Undergraduate",
                label: language === "en" ? "Undergraduate" : "स्नातक नभएको",
              },
            ],
          },
          {
            name: "Academic_Year",
            label: language === "en" ? "Academic Year" : "शैक्षिक वर्ष",
            type: "select",
            required: true,
            options: [
              {
                value: "Final",
                label: language === "en" ? "Final Year" : "अन्तिम वर्ष",
              },
              {
                value: "Pre Final",
                label:
                  language === "en" ? "Pre-Final Year" : "अन्तिम वर्ष अघि",
              },
              {
                value: "Early",
                label: language === "en" ? "Early Years" : "सुरुवाती वर्षहरू",
              },
              {
                value: "None",
                label: language === "en" ? "None" : "कुनै पनि होइन",
              },
            ],
          },
          {
            name: "Academic_Stream",
            label: language === "en" ? "Academic Stream" : "शैक्षिक धारा",
            type: "select",
            required: true,
            options: [
              {
                value: "BE Computer",
                label: language === "en" ? "BE Computer" : "बि.ई कम्प्युटर",
              },
              {
                value: "CSIT",
                label: language === "en" ? "CSIT" : translateValue("CSIT"),
              },
              {
                value: "BCA",
                label: language === "en" ? "BCA" : translateValue("BCA"),
              },
              {
                value: "BITM",
                label: language === "en" ? "BITM" : translateValue("BITM"),
              },
              {
                value: "Others",
                label: language === "en" ? "Others" : "अन्य",
              },
            ],
          },
        ],
      },
      {
        step: 2,
        title:
          language === "en" ? "Performance & Skills" : "प्रदर्शन र सीपहरू",
        fields: [
          {
            name: "Performance",
            label:
              language === "en" ? "Overall Performance" : "समग्र प्रदर्शन",
            type: "select",
            required: true,
            options: [
              { value: "Good", label: language === "en" ? "Good" : "राम्रो" },
              {
                value: "Average",
                label: language === "en" ? "Average" : "औसत",
              },
              { value: "Poor", label: language === "en" ? "Poor" : "खराब" },
            ],
          },
          {
            name: "Project_Domain",
            label: language === "en" ? "Project Domain" : "प्रोजेक्ट डोमेन",
            type: "select",
            required: true,
            options: [
              {
                value: "Web",
                label:
                  language === "en" ? "Web Development" : "वेब विकास",
              },
              {
                value: "Mobile",
                label:
                  language === "en" ? "Mobile Development" : "मोबाइल विकास",
              },
              {
                value: "Data_Science",
                label: language === "en" ? "Data Science" : "डाटा साइन्स",
              },
              {
                value: "Networking",
                label: language === "en" ? "Networking" : "नेटवर्किङ",
              },
              {
                value: "UI_UX",
                label:
                  language === "en" ? "UI/UX Design" : "यूआई/यूएक्स डिजाइन",
              },
              {
                value: "None",
                label: language === "en" ? "None" : "कुनै पनि होइन",
              },
            ],
          },
          {
            name: "Skill_Confidence",
            label: language === "en" ? "Skill Confidence" : "सीप आत्मविश्वास",
            type: "select",
            required: true,
            options: [
              { value: "High", label: language === "en" ? "High" : "उच्च" },
              {
                value: "Medium",
                label: language === "en" ? "Medium" : "मध्यम",
              },
              { value: "Low", label: language === "en" ? "Low" : "निम्न" },
            ],
          },
        ],
      },
      {
        step: 3,
        title:
          language === "en" ? "Learning & Experience" : "सिकाई र अनुभव",
        fields: [
          {
            name: "Learning_Method",
            label:
              language === "en"
                ? "Preferred Learning Method"
                : "रुचाइएको सिकाई विधि",
            type: "select",
            required: true,
            options: [
              {
                value: "Real Project",
                label:
                  language === "en" ? "Real Projects" : "वास्तविक प्रोजेक्टहरू",
              },
              {
                value: "Bootcamp",
                label: language === "en" ? "Bootcamp" : "बुटक्याम्प",
              },
              {
                value: "Self Learning",
                label: language === "en" ? "Self Learning" : "स्व-सिकाई",
              },
              {
                value: "University Course",
                label:
                  language === "en"
                    ? "University Courses"
                    : "विश्वविद्यालय पाठ्यक्रमहरू",
              },
            ],
          },
          {
            name: "Internship",
            label:
              language === "en" ? "Internship Experience" : "इन्टर्नशिप अनुभव",
            type: "radio",
            required: true,
            options: [
              { value: "Yes", label: language === "en" ? "Yes" : "छ" },
              { value: "No", label: language === "en" ? "No" : "छैन" },
            ],
          },
        ],
      },
      {
        step: 4,
        title:
          language === "en" ? "Career Preferences" : "करियर प्राथमिकताहरू",
        fields: [
          {
            name: "Career_Goal",
            label: language === "en" ? "Career Goal" : "करियर लक्ष्य",
            type: "select",
            required: true,
            options: [
              {
                value: "Corporate Job",
                label:
                  language === "en" ? "Corporate Job" : "कर्पोरेट जागिर",
              },
              {
                value: "Startup Company",
                label:
                  language === "en" ? "Startup Company" : "स्टार्टअप कम्पनी",
              },
              {
                value: "Free Lancing",
                label: language === "en" ? "Freelancing" : "फ्रिलान्सिङ",
              },
              {
                value: "Undecided",
                label: language === "en" ? "Undecided" : "अनिर्णित",
              },
            ],
          },
          {
            name: "Availability",
            label: language === "en" ? "Work Availability" : "काम उपलब्धता",
            type: "select",
            required: true,
            options: [
              {
                value: "Full Time",
                label: language === "en" ? "Full Time" : "पूर्णकालीन",
              },
              {
                value: "Part Time",
                label: language === "en" ? "Part Time" : "आंशिक समय",
              },
            ],
          },
        ],
      },
    ],
    plusTwo: [
      {
        step: 1,
        title: language === "en" ? "Academic Information" : "शैक्षिक जानकारी",
        fields: [
          {
            name: "Overall_GPA",
            label: language === "en" ? "Overall GPA" : "+२ GPA",
            type: "select",
            required: true,
            options: [
              { value: ">3.6", label: language === "en" ? ">3.6" : ">३.६" },
              {
                value: "2.8-3.6",
                label: language === "en" ? "2.8-3.6" : "२.८-३.६",
              },
              {
                value: "2.0-2.8",
                label: language === "en" ? "2.0-2.8" : "२.०-२.८",
              },
            ],
          },
          {
            name: "Faculty",
            label: language === "en" ? "Faculty" : "संकाय",
            type: "select",
            required: true,
            options: [
              {
                value: "Science",
                label: language === "en" ? "Science" : "विज्ञान",
              },
              {
                value: "Management",
                label: language === "en" ? "Management" : "व्यवस्थापन",
              },
              {
                value: "Humanities",
                label: language === "en" ? "Humanities" : "मानविकी",
              },
            ],
          },
        ],
      },
      {
        step: 2,
        title: language === "en" ? "Program & Fees" : "कार्यक्रम र शुल्क",
        fields: [
          {
            name: "Program",
            label:
              language === "en" ? "Preferred Program" : "रोजेको कार्यक्रम",
            type: "select",
            required: true,
            options: [
              {
                value: "Computer Engineering",
                label:
                  language === "en"
                    ? "Computer Engineering"
                    : translateValue("Computer Engineering"),
              },
              {
                value: "CSIT",
                label: language === "en" ? "CSIT" : translateValue("CSIT"),
              },
              {
                value: "BCA",
                label: language === "en" ? "BCA" : translateValue("BCA"),
              },
              {
                value: "BITM",
                label: language === "en" ? "BITM" : translateValue("BITM"),
              },
            ],
          },
          {
            name: "Fee",
            label: t("form.feePreference"),
            type: "select",
            required: true,
            options: [
              { value: "High", label: language === "en" ? "High" : "उच्च" },
              { value: "Mid", label: language === "en" ? "Mid" : "मध्यम" },
              { value: "Low", label: language === "en" ? "Low" : "निम्न" },
            ],
          },
          {
            name: "Scholarship",
            label: t("form.scholarship"),
            type: "radio",
            required: true,
            options: [
              { value: "Yes", label: t("form.yes") },
              { value: "No", label: t("form.no") },
            ],
          },
        ],
      },
      {
        step: 3,
        title:
          language === "en" ? "Lab & Infrastructure" : "प्रयोगशाला र पूर्वाधार",
        fields: [
          {
            name: "Lab_Specialization",
            label:
              language === "en"
                ? "Lab Specialization"
                : "प्रयोगशाला विशेषज्ञता",
            type: "select",
            required: true,
            options: [
              {
                value: "Advanced_Engineering",
                label:
                  language === "en"
                    ? "Advanced Engineering"
                    : "उन्नत इन्जिनियरिङ",
              },
              {
                value: "General_CS",
                label:
                  language === "en"
                    ? "General CS"
                    : "सामान्य कम्प्युटर विज्ञान",
              },
              {
                value: "Basic_CS",
                label:
                  language === "en" ? "Basic CS" : "आधारभूत कम्प्युटर विज्ञान",
              },
              {
                value: "None",
                label: language === "en" ? "None" : "कुनै पनि होइन",
              },
            ],
          },
          {
            name: "Infrastructure",
            label: t("form.infrastructure"),
            type: "select",
            required: true,
            options: [
              { value: "Good", label: language === "en" ? "Good" : "राम्रो" },
              {
                value: "Average",
                label: language === "en" ? "Average" : "औसत",
              },
              { value: "Poor", label: language === "en" ? "Poor" : "खराब" },
            ],
          },
        ],
      },
      {
        step: 4,
        title:
          language === "en" ? "Additional Preferences" : "थप प्राथमिकताहरू",
        fields: [
          {
            name: "Admission_Competitiveness",
            label:
              language === "en"
                ? "Admission Competitiveness"
                : "भर्ना प्रतिस्पर्धात्मकता",
            type: "select",
            required: true,
            options: [
              {
                value: "Very Hard",
                label: language === "en" ? "Very Hard" : "धेरै कठिन",
              },
              {
                value: "Hard",
                label: language === "en" ? "Hard" : "कठिन",
              },
              {
                value: "Medium",
                label: language === "en" ? "Medium" : "मध्यम",
              },
              {
                value: "Easy",
                label: language === "en" ? "Easy" : "सजिलो",
              },
              {
                value: "Very Easy",
                label: language === "en" ? "Very Easy" : "धेरै सजिलो",
              },
            ],
          },
          {
            name: "ECA_Availability",
            label: language === "en" ? "ECA Availability" : "ECA उपलब्धता",
            type: "select",
            required: true,
            options: [
              {
                value: "Good",
                label: language === "en" ? "Good" : "राम्रो",
              },
              {
                value: "Average",
                label: language === "en" ? "Average" : "औसत",
              },
              {
                value: "Poor",
                label: language === "en" ? "Poor" : "खराब",
              },
            ],
          },
          {
            name: "Teaching_Focus",
            label: language === "en" ? "Teaching Focus" : "शिक्षण केन्द्रित",
            type: "select",
            required: true,
            options: [
              {
                value: "Theory",
                label: language === "en" ? "Theory" : "सैद्धान्तिक",
              },
              {
                value: "Balanced",
                label: language === "en" ? "Balanced" : "सन्तुलित",
              },
              {
                value: "Practical",
                label: language === "en" ? "Practical" : "व्यावहारिक",
              },
            ],
          },
        ],
      },
    ],
    see: [
      {
        step: 1,
        title:
          language === "en" ? "Academic Performance" : "शैक्षिक प्रदर्शन",
        fields: [
          {
            name: "SEE_GPA",
            label: language === "en" ? "SEE GPA" : "SEE GPA",
            type: "select",
            required: true,
            options: [
              { value: ">3.6", label: language === "en" ? ">3.6" : ">३.६" },
              {
                value: "3.2-3.6",
                label: language === "en" ? "3.2-3.6" : "३.२-३.६",
              },
              {
                value: "2.8-3.2",
                label: language === "en" ? "2.8-3.2" : "२.८-३.२",
              },
              {
                value: "2.0-2.8",
                label: language === "en" ? "2.0-2.8" : "२.०-२.८",
              },
            ],
          },
          {
            name: "SEE_Science_GPA",
            label: language === "en" ? "SEE Science GPA" : "SEE विज्ञान GPA",
            type: "select",
            required: true,
            options: [
              { value: ">3.2", label: language === "en" ? ">3.2" : ">३.२" },
              {
                value: "2.4-3.2",
                label: language === "en" ? "2.4-3.2" : "२.४-३.२",
              },
              {
                value: "2.0-2.4",
                label: language === "en" ? "2.0-2.4" : "२.०-२.४",
              },
            ],
          },
          {
            name: "SEE_Math_GPA",
            label: language === "en" ? "SEE Math GPA" : "SEE गणित GPA",
            type: "select",
            required: true,
            options: [
              { value: ">3.2", label: language === "en" ? ">3.2" : ">३.२" },
              {
                value: "2.4-3.2",
                label: language === "en" ? "2.4-3.2" : "२.४-३.२",
              },
              {
                value: "2.0-2.4",
                label: language === "en" ? "2.0-2.4" : "२.०-२.४",
              },
            ],
          },
        ],
      },
      {
        step: 2,
        title:
          language === "en"
            ? "Preferences & Requirements"
            : "प्राथमिकताहरू र आवश्यकताहरू",
        fields: [
          {
            name: "Fee",
            label: t("form.feePreference"),
            type: "select",
            required: true,
            options: [
              { value: "High", label: t("form.high") },
              { value: "Medium", label: t("form.medium") },
              { value: "Low", label: t("form.low") },
            ],
          },
          {
            name: "Hostel",
            label: t("form.hostel"),
            type: "radio",
            required: true,
            options: [
              { value: "Yes", label: t("form.yes") },
              { value: "No", label: t("form.no") },
            ],
          },
          {
            name: "Transportation",
            label: t("form.transportation"),
            type: "radio",
            required: true,
            options: [
              { value: "Yes", label: t("form.yes") },
              { value: "No", label: t("form.no") },
            ],
          },
          {
            name: "College_Location",
            label:
              language === "en"
                ? "College Location Preference"
                : "कलेज स्थान प्राथमिकता",
            type: "select",
            required: true,
            options: [
              {
                value: "Central",
                label: language === "en" ? "Central" : "केन्द्र",
              },
              {
                value: "Peripheral",
                label: language === "en" ? "Peripheral" : "परिधीय",
              },
              {
                value: "Outskirts",
                label: language === "en" ? "Outskirts" : "उपनगर",
              },
            ],
          },
        ],
      },
      {
        step: 3,
        title:
          language === "en" ? "Activities & Support" : "गतिविधिहरू र सहयोग",
        fields: [
          {
            name: "ECA",
            label: t("form.eca"),
            type: "select",
            required: true,
            options: [
              { value: "Strong", label: t("form.strong") },
              { value: "Weak", label: t("form.weak") },
            ],
          },
          {
            name: "Scholarship",
            label: t("form.scholarship"),
            type: "radio",
            required: true,
            options: [
              { value: "Yes", label: t("form.yes") },
              { value: "No", label: t("form.no") },
            ],
          },
        ],
      },
      {
        step: 4,
        title:
          language === "en"
            ? "Infrastructure Preferences"
            : "अवस्थापना प्राथमिकताहरू",
        fields: [
          {
            name: "Science_Labs",
            label: t("form.scienceLabs"),
            type: "select",
            required: true,
            options: [
              {
                value: "Excellent",
                label: language === "en" ? "Excellent" : "उत्कृष्ट",
              },
              { value: "Good", label: language === "en" ? "Good" : "राम्रो" },
              {
                value: "Average",
                label: language === "en" ? "Average" : "औसत",
              },
              { value: "Poor", label: language === "en" ? "Poor" : "खराब" },
            ],
          },
          {
            name: "Infrastructure",
            label: t("form.infrastructure"),
            type: "select",
            required: true,
            options: [
              { value: "Excellent", label: t("form.excellent") },
              { value: "Average", label: t("form.average") },
              { value: "Poor", label: t("form.poor") },
            ],
          },
        ],
      },
    ],
  };

  const steps = formSteps[userType] || [];
  const totalSteps = steps.length;

  const handleInputChange = (fieldName, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [fieldName]: value };

      // If faculty changes, ensure Program is valid for the selected faculty
      if (fieldName === "Faculty") {
        const faculty = value;
        const mapping = {
          Science: ["Computer Engineering", "CSIT", "BCA", "BITM", "BIM"],
          Management: ["BCA", "BITM"],
          Humanities: ["BIM"],
        };
        const allowed = mapping[faculty] || [];
        if (prev.Program && !allowed.includes(prev.Program)) {
          updated.Program = "";
        }
      }

      // If Current_Status changes (bachelor form), ensure Academic_Year is valid
      if (fieldName === "Current_Status") {
        const status = value;
        if (status === "Graduate") {
          updated.Academic_Year = "None";
        } else {
          if (
            prev.Academic_Year === "None" ||
            !["Final", "Pre Final", "Early"].includes(prev.Academic_Year)
          ) {
            updated.Academic_Year = "";
          }
        }
      }

      return updated;
    });

    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };

  const validateStep = (step) => {
    const stepFields = steps.find((s) => s.step === step)?.fields || [];
    const newErrors = {};

    stepFields.forEach((field) => {
      const v = formData[field.name]?.trim?.() || formData[field.name];
      if (field.required && !v) {
        newErrors[field.name] =
          language === "en" ? "Required" : "आवश्यक";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitModelRegistration = async () => {
    // Validate ALL steps before submission, not just current step
    let allStepsValid = true;
    const allErrors = {};
    
    for (let step = 1; step <= totalSteps; step++) {
      const stepFields = steps.find((s) => s.step === step)?.fields || [];
      stepFields.forEach((field) => {
        const v = formData[field.name]?.trim?.() || formData[field.name];
        if (field.required && !v) {
          allErrors[field.name] =
            language === "en" ? "Required" : "आवश्यक";
          allStepsValid = false;
        }
      });
    }
    
    if (!allStepsValid) {
      setErrors(allErrors);
      // Scroll to first error
      const firstErrorField = Object.keys(allErrors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setLoading(true);
    try {
      // Prepare model-specific attributes
      const fieldsByDataset = {
        see: [
          "SEE_GPA",
          "SEE_Science_GPA",
          "SEE_Math_GPA",
          "Fee",
          "Hostel",
          "Transportation",
          "ECA",
          "Scholarship",
          "Science_Labs",
          "Infrastructure",
          "College_Location",
        ],
        plusTwo: [
          "Overall_GPA",
          "Faculty",
          "Program",
          "Fee",
          "Scholarship",
          "Lab_Specialization",
          "Admission_Competitiveness",
          "ECA_Availability",
          "Infrastructure",
          "Teaching_Focus",
        ],
        bachelor: [
          "Current_Status",
          "Academic_Year",
          "Academic_Stream",
          "Performance",
          "Project_Domain",
          "Internship",
          "Learning_Method",
          "Career_Goal",
          "Skill_Confidence",
          "Availability",
        ],
      };

      const fields = fieldsByDataset[userType] || [];
      const attributes = {};

      // Normalize values to match training data format
      const normalizeValue = (fieldName, value) => {
        if (value === null || value === undefined || value === "") return value;
        
        // Normalize Bachelor's form values
        if (userType === "bachelor") {
          // Learning_Method normalization
          if (fieldName === "Learning_Method") {
            if (value === "Real_Project") return "Real Project";
            if (value === "Self_Learning") return "Self Learning";
            if (value === "University_Courses") return "University Course";
          }
          // Academic_Year normalization
          if (fieldName === "Academic_Year") {
            if (value === "Pre_Final") return "Pre Final";
          }
          // Career_Goal normalization
          if (fieldName === "Career_Goal") {
            if (value === "Freelancing") return "Free Lancing";
          }
        }
        
        return value;
      };

      // Collect ALL required fields, checking if they exist in formData
      const missingFields = [];
      fields.forEach((field) => {
        let value = formData[field];
        
        // Special case: Academic_Year should be "None" for Graduate status
        if (field === "Academic_Year" && formData.Current_Status === "Graduate") {
          value = "None";
        }
        
        // Check if value exists and is not empty ("None" is a valid value for Academic_Year)
        if (value !== null && value !== undefined && value !== "") {
          const normalized = normalizeValue(field, value);
          attributes[field] = normalized;
        } else {
          missingFields.push(field);
        }
      });

      // Debug logging
      console.log("Form submission debug:", {
        userType,
        formData,
        attributes,
        missingFields,
        fieldsExpected: fields,
      });

      // If any required fields are missing, show error
      if (missingFields.length > 0) {
        const missingErrors = {};
        missingFields.forEach((field) => {
          missingErrors[field] =
            language === "en" ? "This field is required" : "यो क्षेत्र आवश्यक छ";
        });
        setErrors(missingErrors);
        setLoading(false);
        
        // Navigate to the step containing the first missing field
        const firstMissingField = missingFields[0];
        const stepWithField = steps.find((step) =>
          step.fields.some((f) => f.name === firstMissingField)
        );
        if (stepWithField) {
          setCurrentStep(stepWithField.step);
        }
        
        // Scroll to first missing field after a brief delay
        setTimeout(() => {
          const errorElement = document.querySelector(`[name="${firstMissingField}"]`);
          if (errorElement) {
            errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
            errorElement.focus();
          }
        }, 100);
        return;
      }

      // Save model registration
      const res = await fetch(
        "http://localhost:3001/api/user/modelRegistration",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ attributes }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage =
          errorData.error ||
          errorData.details?.missingAttributes
            ? `Missing fields: ${errorData.details.missingAttributes.join(", ")}`
            : errorData.details?.invalidAttributes
            ? `Invalid values: ${errorData.details.invalidAttributes
                .map((a) => a.attribute)
                .join(", ")}`
            : "Failed to save model registration";
        throw new Error(errorMessage);
      }

      // Generate recommendations using the saved attributes
      try {
        const recRes = await fetch(
          "http://localhost:3001/api/recommendations",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              studentData: attributes,
              datasetName: userType,
            }),
          }
        );

        if (recRes.ok) {
          const recData = await recRes.json();
          if (recData.success) {
            // Save recommendation to user account
            const saveRes = await fetch(
              "http://localhost:3001/api/user/recommendations",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                  datasetName: userType,
                  prediction: recData.recommendations.college,
                  studentProfile: recData.studentProfile,
                }),
              }
            );
            if (!saveRes.ok) {
              console.warn("Failed to save recommendation to account");
            }
          }
        } else {
          const errorData = await recRes.json().catch(() => ({}));
          console.warn(
            "Failed to generate recommendations:",
            errorData.error || "Unknown error"
          );
        }
      } catch (recError) {
        console.warn("Failed to generate recommendations:", recError);
        // Continue even if recommendation generation fails
      }

      // Load all data (user, modelRegistration, recommendations) immediately
      await loadAllData();

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving model registration:", error);
      setErrors({
        submit: error.message || "Failed to save model registration",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => {
    const hasError = errors[field.name];

    switch (field.type) {
      case "select":
        // Special case: dynamic Program options for +2 graduates
        if (field.name === "Program" && userType === "plusTwo") {
          const programMapping = {
            Science: [
              {
                value: "Computer Engineering",
                label: translateValue("Computer Engineering"),
              },
              { value: "CSIT", label: translateValue("CSIT") },
              { value: "BCA", label: translateValue("BCA") },
              { value: "BITM", label: translateValue("BITM") },
              { value: "BIM", label: translateValue("BIM") },
            ],
            Management: [
              { value: "BCA", label: translateValue("BCA") },
              { value: "BITM", label: translateValue("BITM") },
            ],
            Humanities: [{ value: "BIM", label: translateValue("BIM") }],
          };

          const faculty = formData.Faculty;
          const optionsToShow = faculty
            ? programMapping[faculty] || []
            : [
                {
                  value: "Computer Engineering",
                  label: translateValue("Computer Engineering"),
                },
                { value: "CSIT", label: translateValue("CSIT") },
                { value: "BCA", label: translateValue("BCA") },
                { value: "BITM", label: translateValue("BITM") },
                { value: "BIM", label: translateValue("BIM") },
              ];

          return (
            <div>
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  hasError ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">
                  {language === "en"
                    ? `Select ${field.label}`
                    : `${field.label} चयन गर्नुहोस्`}
                </option>
                {optionsToShow.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {hasError && (
                <p className="text-red-500 text-sm mt-1">{hasError}</p>
              )}
            </div>
          );
        }

        // Special case: Academic_Year options for bachelor's graduates
        if (field.name === "Academic_Year" && userType === "bachelor") {
          const status = formData.Current_Status;

          const optionsForGraduate = [
            { value: "None", label: translateValue("None") },
          ];

          const optionsForUndergrad = [
            { value: "Final", label: translateValue("Final") },
            { value: "Pre Final", label: translateValue("Pre Final") },
            { value: "Early", label: translateValue("Early") },
          ];

          const optionsToShow =
            status === "Graduate" ? optionsForGraduate : optionsForUndergrad;

          return (
            <div>
              <select
                id={field.name}
                name={field.name}
                value={formData[field.name] || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  hasError ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">
                  {language === "en"
                    ? `Select ${field.label}`
                    : `${field.label} चयन गर्नुहोस्`}
                </option>
                {optionsToShow.map((option) => (
                  <option key={option.value} value={option.value}>
                    {language === "en" ? option.label : option.label}
                  </option>
                ))}
              </select>
              {hasError && (
                <p className="text-red-500 text-sm mt-1">{hasError}</p>
              )}
            </div>
          );
        }

        return (
          <div>
            <select
              id={field.name}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                hasError ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">
                {language === "en"
                  ? `Select ${field.label}`
                  : `${field.label} चयन गर्नुहोस्`}
              </option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {hasError && (
              <p className="text-red-500 text-sm mt-1">{hasError}</p>
            )}
          </div>
        );

      case "radio":
        return (
          <div>
            <div className="flex space-x-6">
              {field.options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="radio"
                    id={`${field.name}-${option.value}`}
                    name={field.name}
                    value={option.value}
                    checked={formData[field.name] === option.value}
                    onChange={(e) =>
                      handleInputChange(field.name, e.target.value)
                    }
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
            {hasError && (
              <p className="text-red-500 text-sm mt-1">{hasError}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === "en" ? "Loading..." : "लोड हुँदैछ..."}
          </h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {language === "en" ? "Please Login" : "कृपया लगइन गर्नुहोस्"}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === "en"
              ? "You need to be logged in to complete model registration."
              : "मोडेल दर्ता पूरा गर्न तपाईंले लगइन गर्नुपर्छ।"}
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {language === "en" ? "Go to Login" : "लगइनमा जानुहोस्"}
          </button>
        </div>
      </div>
    );
  }

  if (!userType || !formSteps[userType]) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {language === "en" ? "Invalid User Type" : "अवैध प्रयोगकर्ता प्रकार"}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === "en"
              ? "Your user type is not supported for model registration."
              : "तपाईंको प्रयोगकर्ता प्रकार मोडेल दर्ताका लागि समर्थित छैन।"}
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {language === "en" ? "Go to Dashboard" : "ड्यासबोर्डमा जानुहोस्"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {language === "en" ? "Model Registration" : "मोडेल दर्ता"}{" "}
            {userTypeLabels[userType]}
          </h1>
          <p className="text-lg text-gray-600">
            {language === "en"
              ? "Complete the form below to receive personalized recommendations"
              : "व्यक्तिगत सिफारिसहरू प्राप्त गर्न तलको फारम पूरा गर्नुहोस्"}
          </p>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {errors.submit}
          </div>
        )}

        {/* Show missing fields summary if there are validation errors */}
        {Object.keys(errors).filter((key) => key !== "submit" && errors[key]).length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold mb-2">
              {language === "en"
                ? "Please complete the following required fields:"
                : "कृपया निम्न आवश्यक क्षेत्रहरू पूरा गर्नुहोस्:"}
            </p>
            <ul className="list-disc list-inside space-y-1">
              {Object.entries(errors)
                .filter(([key, value]) => key !== "submit" && value)
                .map(([key, value]) => {
                  const field = steps
                    .flatMap((s) => s.fields)
                    .find((f) => f.name === key);
                  return (
                    <li key={key}>
                      {field?.label || key}: {value}
                    </li>
                  );
                })}
            </ul>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Progress Bar */}
          <div className="bg-gray-50 px-8 py-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                {language === "en" ? "Step" : "चरण"}{" "}
                {language === "ne" ? toNepaliNumber(currentStep) : currentStep}{" "}
                {language === "en" ? "of" : "मध्ये"}{" "}
                {language === "ne" ? toNepaliNumber(totalSteps) : totalSteps}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {language === "ne"
                  ? toNepaliNumber(Math.round((currentStep / totalSteps) * 100))
                  : Math.round((currentStep / totalSteps) * 100)}
                % {language === "en" ? "Complete" : "पूरा"}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {steps.map(
              (step) =>
                step.step === currentStep && (
                  <div key={step.step}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                      {step.title}
                    </h2>

                    <div className="grid gap-6">
                      {step.fields.map((field) => (
                        <div key={field.name}>
                          <label
                            htmlFor={field.name}
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            {field.label}
                            {field.required && (
                              <span className="text-red-500 ml-1">*</span>
                            )}
                          </label>
                          {renderField(field)}
                        </div>
                      ))}
                    </div>
                  </div>
                )
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  currentStep === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {language === "en" ? "Previous" : "अघिल्लो"}
              </button>

              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {language === "en" ? "Next" : "अर्को"}
                </button>
              ) : (
                <button
                  onClick={submitModelRegistration}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
                >
                  {loading
                    ? language === "en"
                      ? "Saving..."
                      : "सेभ गर्दै..."
                    : language === "en"
                    ? "Complete Registration"
                    : "दर्ता पूरा गर्नुहोस्"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelRegistration;

