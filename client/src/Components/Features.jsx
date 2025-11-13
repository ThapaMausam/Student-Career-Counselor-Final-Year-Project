// src/components/Features.jsx
import { useLanguage, toNepaliNumber } from '../hooks/useLanguage';

const Features = ({ language, setLanguage }) => {
  const { t } = useLanguage(language, setLanguage);
  
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {t('features.title')}
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {t('features.items').map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4">
                <span className="text-xl">
                  {language === 'ne' ? toNepaliNumber(index + 1) : index + 1}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-flex rounded-md shadow">
            <button className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors">
              {t('features.learnAlgorithm')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;