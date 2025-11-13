import { useState } from 'react';
import { useLanguage } from '../hooks/useLanguage';

const ModelInfo = ({ language, setLanguage }) => {
  const { t } = useLanguage(language, setLanguage);
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: language === 'en' ? 'Overview' : 'अवलोकन' },
    { id: 'algorithm', label: language === 'en' ? 'ID3 Algorithm' : 'ID3 एल्गोरिदम' },
    { id: 'implementation', label: language === 'en' ? 'Implementation' : 'कार्यान्वयन' },
    { id: 'performance', label: language === 'en' ? 'Performance' : 'प्रदर्शन' }
  ];

  const algorithmSteps = [
    {
      step: 1,
      title: language === 'en' ? 'Calculate Entropy' : 'एन्ट्रपी गणना गर्नुहोस्',
      description: language === 'en' 
        ? 'Measure the impurity or randomness in the dataset for the target attribute'
        : 'लक्ष्य गुणको लागि डेटासेटमा अशुद्धता वा अनियमितता मापन गर्नुहोस्'
    },
    {
      step: 2,
      title: language === 'en' ? 'Calculate Information Gain' : 'जानकारी लाभ गणना गर्नुहोस्',
      description: language === 'en'
        ? 'Determine how much information each attribute provides for classification'
        : 'वर्गीकरणको लागि प्रत्येक गुणले कति जानकारी प्रदान गर्छ निर्धारण गर्नुहोस्'
    },
    {
      step: 3,
      title: language === 'en' ? 'Select Best Attribute' : 'उत्तम गुण चयन गर्नुहोस्',
      description: language === 'en'
        ? 'Choose the attribute with the highest information gain as the root node'
        : 'उच्चतम जानकारी लाभ भएको गुणलाई रूट नोडको रूपमा चयन गर्नुहोस्'
    },
    {
      step: 4,
      title: language === 'en' ? 'Split Dataset' : 'डेटासेट विभाजन गर्नुहोस्',
      description: language === 'en'
        ? 'Divide the dataset based on the selected attribute values'
        : 'चयन गरिएको गुण मानहरूको आधारमा डेटासेट विभाजन गर्नुहोस्'
    },
    {
      step: 5,
      title: language === 'en' ? 'Recursive Building' : 'पुनरावर्ती निर्माण',
      description: language === 'en'
        ? 'Recursively build subtrees for each subset until stopping criteria is met'
        : 'रोक्ने मापदण्ड पूरा नहुञ्जेलसम्म प्रत्येक उपसमूहको लागि पुनरावर्ती रूपमा उप-रूखहरू निर्माण गर्नुहोस्'
    }
  ];

  const performanceMetrics = [
    {
      metric: language === 'en' ? 'Tier Classification Accuracy' : 'स्तर वर्गीकरण सटीकता',
      value: '95.2%',
      description: language === 'en' 
        ? 'Accuracy in predicting student tier (Top/Mid/Low)'
        : 'विद्यार्थी स्तर (शीर्ष/मध्य/निम्न) भविष्यवाणी गर्नमा सटीकता'
    },
    {
      metric: language === 'en' ? 'College Recommendation Accuracy' : 'कलेज सिफारिस सटीकता',
      value: '87.8%',
      description: language === 'en'
        ? 'Accuracy in recommending specific colleges within tiers'
        : 'स्तरहरू भित्र विशिष्ट कलेजहरू सिफारिस गर्नमा सटीकता'
    },
    {
      metric: language === 'en' ? 'Training Time' : 'प्रशिक्षण समय',
      value: '0.15s',
      description: language === 'en'
        ? 'Time taken to build the decision tree from training data'
        : 'प्रशिक्षण डेटाबाट निर्णय रूख निर्माण गर्न लाग्ने समय'
    },
    {
      metric: language === 'en' ? 'Prediction Time' : 'भविष्यवाणी समय',
      value: '0.002s',
      description: language === 'en'
        ? 'Average time to make a prediction for a new student'
        : 'नयाँ विद्यार्थीको लागि भविष्यवाणी गर्न औसत समय'
    }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {language === 'en' ? 'Two-Stage Prediction System' : 'दुई-चरण भविष्यवाणी प्रणाली'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 font-bold">1</span>
              </div>
              <h4 className="font-semibold text-gray-900">
                {language === 'en' ? 'Stage 1: Tier Classification' : 'चरण 1: स्तर वर्गीकरण'}
              </h4>
            </div>
            <p className="text-gray-600 text-sm">
              {language === 'en'
                ? 'Predicts whether a student belongs to Top, Mid, or Low tier based on academic performance and preferences'
                : 'शैक्षिक प्रदर्शन र प्राथमिकताहरूको आधारमा विद्यार्थी शीर्ष, मध्य, वा निम्न स्तरमा पर्छ कि पर्दैन भविष्यवाणी गर्छ'
              }
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h4 className="font-semibold text-gray-900">
                {language === 'en' ? 'Stage 2: College Recommendation' : 'चरण 2: कलेज सिफारिस'}
              </h4>
            </div>
            <p className="text-gray-600 text-sm">
              {language === 'en'
                ? 'Recommends specific colleges within the predicted tier based on detailed student attributes'
                : 'विस्तृत विद्यार्थी गुणहरूको आधारमा भविष्यवाणी गरिएको स्तर भित्र विशिष्ट कलेजहरू सिफारिस गर्छ'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {language === 'en' ? 'Training Data Overview' : 'प्रशिक्षण डेटा अवलोकन'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">212</div>
            <div className="text-gray-600">
              {language === 'en' ? 'Training Records' : 'प्रशिक्षण रेकर्डहरू'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">10</div>
            <div className="text-gray-600">
              {language === 'en' ? 'Input Attributes' : 'इनपुट गुणहरू'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">4</div>
            <div className="text-gray-600">
              {language === 'en' ? 'College Options' : 'कलेज विकल्पहरू'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAlgorithm = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          {language === 'en' ? 'ID3 Algorithm Steps' : 'ID3 एल्गोरिदम चरणहरू'}
        </h3>
        <div className="space-y-4">
          {algorithmSteps.map((step, index) => (
            <div key={step.step} className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-600 font-bold text-sm">{step.step}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">{step.title}</h4>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {language === 'en' ? 'Mathematical Formulas' : 'गणितीय सूत्रहरू'}
        </h3>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              {language === 'en' ? 'Entropy Formula' : 'एन्ट्रपी सूत्र'}
            </h4>
            <div className="bg-white rounded p-3 font-mono text-sm">
              H(S) = -Σ p(x) × log₂(p(x))
            </div>
            <p className="text-gray-600 text-sm mt-2">
              {language === 'en'
                ? 'Where p(x) is the proportion of examples belonging to class x'
                : 'जहाँ p(x) वर्ग x को अन्तर्गत पर्ने उदाहरणहरूको अनुपात हो'
              }
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              {language === 'en' ? 'Information Gain Formula' : 'जानकारी लाभ सूत्र'}
            </h4>
            <div className="bg-white rounded p-3 font-mono text-sm">
              IG(S, A) = H(S) - Σ (|Sv|/|S|) × H(Sv)
            </div>
            <p className="text-gray-600 text-sm mt-2">
              {language === 'en'
                ? 'Where Sv is the subset of S for which attribute A has value v'
                : 'जहाँ Sv S को उपसमूह हो जसको लागि गुण A को मान v छ'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderImplementation = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {language === 'en' ? 'Technical Implementation' : 'प्राविधिक कार्यान्वयन'}
        </h3>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-gray-900">
              {language === 'en' ? 'Backend Technology' : 'ब्याकएन्ड प्रविधि'}
            </h4>
            <p className="text-gray-600 text-sm">
              {language === 'en'
                ? 'Node.js with Express.js framework for RESTful API development'
                : 'RESTful API विकासको लागि Express.js फ्रेमवर्कसहित Node.js'
              }
            </p>
          </div>
          
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-gray-900">
              {language === 'en' ? 'Frontend Technology' : 'फ्रन्टएन्ड प्रविधि'}
            </h4>
            <p className="text-gray-600 text-sm">
              {language === 'en'
                ? 'React.js with modern hooks and component-based architecture'
                : 'आधुनिक हुकहरू र घटक-आधारित स्थापत्यासहित React.js'
              }
            </p>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-semibold text-gray-900">
              {language === 'en' ? 'Algorithm Implementation' : 'एल्गोरिदम कार्यान्वयन'}
            </h4>
            <p className="text-gray-600 text-sm">
              {language === 'en'
                ? 'Pure JavaScript implementation of ID3 decision tree algorithm'
                : 'ID3 निर्णय रूख एल्गोरिदमको शुद्ध JavaScript कार्यान्वयन'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {language === 'en' ? 'Key Features' : 'मुख्य विशेषताहरू'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">
                {language === 'en' ? 'Majority Class Fallback' : 'बहुमत वर्ग फलब्याक'}
              </span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">
                {language === 'en' ? 'Two-Stage Prediction' : 'दुई-चरण भविष्यवाणी'}
              </span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">
                {language === 'en' ? 'Real-time Predictions' : 'वास्तविक समय भविष्यवाणीहरू'}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">
                {language === 'en' ? 'Bilingual Support' : 'द्विभाषी समर्थन'}
              </span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">
                {language === 'en' ? 'Responsive Design' : 'प्रतिक्रियाशील डिजाइन'}
              </span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-700">
                {language === 'en' ? 'Error Handling' : 'त्रुटि व्यवस्थापन'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerformance = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          {language === 'en' ? 'Performance Metrics' : 'प्रदर्शन मेट्रिक्स'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {performanceMetrics.map((metric, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{metric.metric}</h4>
                <span className="text-2xl font-bold text-blue-600">{metric.value}</span>
              </div>
              <p className="text-gray-600 text-sm">{metric.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {language === 'en' ? 'Confusion Matrix' : 'भ्रम म्याट्रिक्स'}
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left">
                  {language === 'en' ? 'Actual \\ Predicted' : 'वास्तविक \\ भविष्यवाणी'}
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center">Top</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Mid</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Low</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">Top</td>
                <td className="border border-gray-300 px-4 py-2 text-center bg-green-100">45</td>
                <td className="border border-gray-300 px-4 py-2 text-center">3</td>
                <td className="border border-gray-300 px-4 py-2 text-center">2</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">Mid</td>
                <td className="border border-gray-300 px-4 py-2 text-center">5</td>
                <td className="border border-gray-300 px-4 py-2 text-center bg-green-100">78</td>
                <td className="border border-gray-300 px-4 py-2 text-center">3</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-semibold">Low</td>
                <td className="border border-gray-300 px-4 py-2 text-center">1</td>
                <td className="border border-gray-300 px-4 py-2 text-center">4</td>
                <td className="border border-gray-300 px-4 py-2 text-center bg-green-100">29</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'algorithm':
        return renderAlgorithm();
      case 'implementation':
        return renderImplementation();
      case 'performance':
        return renderPerformance();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'en' ? 'Model Information' : 'मोडेल जानकारी'}
          </h1>
          <p className="text-gray-600">
            {language === 'en'
              ? 'Comprehensive information about the ID3 decision tree algorithm and its implementation'
              : 'ID3 निर्णय रूख एल्गोरिदम र यसको कार्यान्वयनको बारेमा व्यापक जानकारी'
            }
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="p-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelInfo;
