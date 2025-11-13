import { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';

const RecommendationForm = ({ userType, language, setLanguage }) => {
  const { t } = useLanguage(language, setLanguage);
  const [formData, setFormData] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  const formSteps = {
    see: [
      {
        step: 1,
        title: 'Academic Performance',
        fields: [
          { name: 'SEE_GPA', label: 'SEE GPA', type: 'select', options: ['>3.6', '2.8-3.6', '2.0-2.8'] },
          { name: 'SEE_Science_GPA', label: 'SEE Science GPA', type: 'select', options: ['>3.2', '2.4-3.2'] },
          { name: 'SEE_Math_GPA', label: 'SEE Math GPA', type: 'select', options: ['>3.2', '2.4-3.2'] }
        ]
      },
      {
        step: 2,
        title: 'Preferences & Requirements',
        fields: [
          { name: 'Fee', label: 'Fee Range', type: 'select', options: ['High', 'Medium', 'Low'] },
          { name: 'Hostel', label: 'Hostel Required', type: 'select', options: ['Yes', 'No'] },
          { name: 'Transportation', label: 'Transportation', type: 'select', options: ['Yes', 'No'] },
          { name: 'College_Location', label: 'College Location', type: 'select', options: ['Central', 'Peripheral', 'Outskirts'] }
        ]
      },
      {
        step: 3,
        title: 'Additional Factors',
        fields: [
          { name: 'ECA', label: 'Extracurricular Activities', type: 'select', options: ['Strong', 'Weak'] },
          { name: 'Scholarship', label: 'Scholarship Required', type: 'select', options: ['Yes', 'No'] },
          { name: 'Science_Labs', label: 'Science Labs Quality', type: 'select', options: ['Good', 'Poor'] },
          { name: 'Infrastructure', label: 'Infrastructure Preference', type: 'select', options: ['Excellent', 'Average', 'Poor'] }
        ]
      }
    ],
    plusTwo: [
      {
        step: 1,
        title: 'Academic Performance',
        fields: [
          { name: 'plusTwoGpa', label: '+2 GPA', type: 'select', options: ['High (>3.0)', 'Medium (2.5-3.0)', 'Low (<2.5)'] },
          { name: 'stream', label: 'Stream', type: 'select', options: ['Science', 'Management', 'Humanities'] },
          { name: 'subjects', label: 'Strong Subjects', type: 'multiselect', options: ['Physics', 'Chemistry', 'Biology', 'Mathematics', 'English', 'Nepali'] }
        ]
      },
      {
        step: 2,
        title: 'Career Goals',
        fields: [
          { name: 'careerGoals', label: 'Career Interests', type: 'multiselect', options: ['Engineering', 'Medicine', 'IT', 'Business', 'Arts', 'Research'] },
          { name: 'location', label: 'Preferred Location', type: 'select', options: ['Kathmandu', 'Pokhara', 'Chitwan', 'Lalitpur', 'Bhaktapur'] },
          { name: 'feeRange', label: 'Fee Range', type: 'select', options: ['Low', 'Medium', 'High'] }
        ]
      }
    ],
    bachelor: [
      {
        step: 1,
        title: 'Academic & Professional Profile',
        fields: [
          { name: 'bachelorGpa', label: 'Bachelor GPA', type: 'select', options: ['High (>3.2)', 'Medium (2.8-3.2)', 'Low (<2.8)'] },
          { name: 'specialization', label: 'Specialization', type: 'select', options: ['Computer Science', 'Information Technology', 'Software Engineering', 'Data Science'] },
          { name: 'skills', label: 'Technical Skills', type: 'multiselect', options: ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'Database', 'Cloud Computing'] }
        ]
      },
      {
        step: 2,
        title: 'Career Preferences',
        fields: [
          { name: 'experience', label: 'Experience Level', type: 'select', options: ['Fresh Graduate', '1-2 years', '3-5 years'] },
          { name: 'jobType', label: 'Job Type', type: 'select', options: ['Full-time', 'Part-time', 'Internship', 'Contract'] },
          { name: 'salaryExpectation', label: 'Salary Expectation', type: 'select', options: ['Low (<50k)', 'Medium (50k-100k)', 'High (>100k)'] },
          { name: 'location', label: 'Preferred Location', type: 'select', options: ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Remote'] }
        ]
      }
    ]
  };

  const steps = formSteps[userType] || [];
  const totalSteps = steps.length;

  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateRecommendations = async () => {
    setLoading(true);
    try {
      // Prepare data for ID3 model - matching see.json attribute names
      const modelInput = {
        SEE_GPA: formData.SEE_GPA,
        SEE_Science_GPA: formData.SEE_Science_GPA,
        SEE_Math_GPA: formData.SEE_Math_GPA,
        Fee: formData.Fee,
        Hostel: formData.Hostel,
        Transportation: formData.Transportation,
        ECA: formData.ECA,
        Scholarship: formData.Scholarship,
        Science_Labs: formData.Science_Labs,
        Infrastructure: formData.Infrastructure,
        College_Location: formData.College_Location
      };

      const response = await fetch('http://localhost:3001/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentData: modelInput,
          datasetName: 'see'
        })
      });

      const data = await response.json();
      if (data.success) {
        setRecommendations([{
          prediction: data.recommendations.college,
          confidence: 0.85, // Default confidence
          reasoning: `Based on your profile, we recommend ${data.recommendations.college} college.`
        }]);
      } else {
        throw new Error(data.error || 'Failed to get recommendations');
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setRecommendations(null);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'select':
        return (
          <select
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select {field.label}</option>
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      case 'multiselect':
        return (
          <div className="space-y-2">
            {field.options.map(option => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData[field.name]?.includes(option) || false}
                  onChange={(e) => {
                    const currentValues = formData[field.name] || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter(v => v !== option);
                    handleInputChange(field.name, newValues);
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
      default:
        return (
          <input
            type="text"
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`Enter ${field.label}`}
          />
        );
    }
  };

  if (recommendations) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Recommendations</h2>
          
          <div className="space-y-6">
            {recommendations.map((rec, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {rec.prediction}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    rec.confidence > 0.8 ? 'bg-green-100 text-green-800' :
                    rec.confidence > 0.6 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {(rec.confidence * 100).toFixed(1)}% Confidence
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{rec.reasoning}</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  View Details
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex space-x-4">
            <button
              onClick={() => {
                setRecommendations(null);
                setCurrentStep(1);
                setFormData({});
              }}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Start Over
            </button>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Save Recommendations
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Current Step */}
        {steps.map(step => (
          step.step === currentStep && (
            <div key={step.step}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{step.title}</h2>
              
              <div className="space-y-6">
                {step.fields.map(field => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </div>
          )
        ))}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>
          
          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={generateRecommendations}
              disabled={loading}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                loading
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {loading ? 'Generating...' : 'Get Recommendations'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationForm;
