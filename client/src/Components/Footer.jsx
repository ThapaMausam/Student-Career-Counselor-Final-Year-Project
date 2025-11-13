import { useLanguage } from '../hooks/useLanguage';

const Footer = ({ language, setLanguage }) => {
  const { t } = useLanguage(language, setLanguage);
  
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {t('footer.links').map((link, index) => (
            <div key={index}>
              <a 
                href={link.url} 
                className="text-gray-300 hover:text-white transition-colors"
              >
                {link.title}
              </a>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 pt-8">
          <p className="text-gray-400 text-center">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
