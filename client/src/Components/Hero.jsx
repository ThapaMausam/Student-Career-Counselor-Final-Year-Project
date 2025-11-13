
import { useLanguage } from '../hooks/useLanguage';
import studentImage from '../assets/student.webp';

const Hero = ({ language, setLanguage }) => {
  const { t } = useLanguage(language, setLanguage);
  
  const scrollToUserTypeSelector = () => {
    const userTypeSelectorElement = document.getElementById('user-type-selector');
    if (userTypeSelectorElement) {
      userTypeSelectorElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Enhanced background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-400/5 to-purple-500/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300/20 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            {/*<div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
             // {language === 'en' ? 'AI-Powered Career Guidance' : 'AI-सक्षम करियर मार्गदर्शन'}
            </div>*}

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              <span className="block">{t('hero.title')}</span>
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {t('hero.forNepaliStudents')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* Key Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {language === 'en' ? 'ID3 Algorithm' : 'ID3 एल्गोरिथ्म'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm">✓</span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {language === 'en' ? 'Personalized Matching' : 'व्यक्तिगत मिलान'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-sm">✓</span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {language === 'en' ? 'Nepal Context' : 'नेपाल संदर्भ'}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <button 
                onClick={scrollToUserTypeSelector}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-full hover:shadow-xl transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {t('hero.cta')}
              </button>
            </div>
          </div>

          {/* Right Content - Enhanced Visual */}
          <div className="relative">
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-white">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 h-96 w-full flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="mb-6">
                    <img 
                      width={300} 
                      height={200} 
                      src={studentImage} 
                      alt="student profile" 
                      className="rounded-2xl shadow-lg mx-auto"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {t('hero.platformTitle')}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {language === 'en' 
                      ? 'Advanced ML-powered recommendations' 
                      : 'उन्नत ML-सक्षम सिफारिसहरू'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <span className="text-2xl"></span>
            </div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-400 rounded-full flex items-center justify-center shadow-lg animate-bounce animation-delay-1000">
              <span className="text-2xl"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
