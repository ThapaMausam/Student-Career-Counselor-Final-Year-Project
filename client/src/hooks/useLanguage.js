
import { useState } from 'react';
import { translations } from '../data/translation';

export const useLanguage = (externalLanguage, externalSetLanguage) => {
  const [internalLanguage, internalSetLanguage] = useState('en');
  const language = externalLanguage !== undefined ? externalLanguage : internalLanguage;
  const setLanguage = externalSetLanguage !== undefined ? externalSetLanguage : internalSetLanguage;

  const t = (key) => {
    try {
      const keys = key.split('.');
      let value = translations[language];
      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) {
          console.warn(`Translation missing for key: ${key} in language: ${language}`);
          return key; // fallback to key if not found
        }
      }
      return value;
    } catch (error) {
      console.error('Translation error:', error);
      return key;
    }
  };

  return { language, setLanguage, t };
};

export const toNepaliNumber = (input) => {
  const enToNeDigits = {'0':'०','1':'१','2':'२','3':'३','4':'४','5':'५','6':'६','7':'७','8':'८','9':'९'};
  return String(input).replace(/[0-9]/g, d => enToNeDigits[d]);
};