
import { useLanguage } from '../hooks/useLanguage';

const Testimonials = ({ language, setLanguage }) => {
  const { t } = useLanguage(language, setLanguage);
  
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900">
            {t('testimonials.title')}
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {t('testimonials.items').map((testimonial, index) => (
            <div 
              key={index}
              className="bg-gray-50 p-8 rounded-xl border border-gray-200"
            >
              <div className="mb-4">
                <svg className="h-8 w-8 text-blue-500" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </div>
              <p className="text-lg text-gray-600 italic mb-6">
                "{testimonial.quote}"
              </p>
              <p className="text-gray-800 font-medium">
                — {testimonial.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;