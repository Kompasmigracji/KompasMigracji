import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ua from './ua.json';
import pl from './pl.json';
import en from './en.json';
import ru from './ru.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ua: { translation: ua },
      pl: { translation: pl },
      en: { translation: en },
      ru: { translation: ru }
    },
    fallbackLng: 'ua',
    interpolation: { escapeValue: false }
  });

export default i18n;