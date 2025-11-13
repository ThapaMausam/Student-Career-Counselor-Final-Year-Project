import { Link } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';

const UserTypeSelector = ({ language, setLanguage }) => {
  const { t } = useLanguage(language, setLanguage);
  
  const userTypes = [
    {
      key: 'see',
      icon: '🎓',
      colorClass: 'bg-blue-100 text-blue-600',
      borderClass: 'border-blue-200',
      hoverClass: 'hover:border-blue-400'
    },
    {
      key: 'plusTwo',
      icon: '📚',
      colorClass: 'bg-purple-100 text-purple-600',
      borderClass: 'border-purple-200',
      hoverClass: 'hover:border-purple-400'
    },
    {
      key: 'bachelor',
      icon: '💼',
      colorClass: 'bg-pink-100 text-pink-600',
      borderClass: 'border-pink-200',
      hoverClass: 'hover:border-pink-400'
    }
  ];
  
  return (
    <section id="user-type-selector" className="py-16 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {t('userTypes.title')}
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-600 mx-auto">
            {t('userTypes.subtitle')}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {userTypes.map((type) => (
            <Link 
              to={`/register/${type.key}`}
              key={type.key}
              className={`rounded-xl p-8 shadow-lg transition-all transform hover:scale-105 hover:shadow-xl ${type.colorClass} border-2 ${type.borderClass} ${type.hoverClass}`}
            >
              <div className="text-5xl mb-4">{type.icon}</div>
              <h3 className="text-2xl font-bold mb-3">
                {t(`userTypes.${type.key}.title`)}
              </h3>
              <p className="text-gray-700 mb-6">
                {t(`userTypes.${type.key}.description`)}
              </p>
              <div className="mt-6">
                <button className={`px-6 py-2 bg-white rounded-full font-medium shadow-sm hover:shadow-md transition-all ${type.colorClass.replace('100', '50')} hover:${type.colorClass.replace('100', '200')}`}>
                  {t(`userTypes.${type.key}.cta`)}
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserTypeSelector;