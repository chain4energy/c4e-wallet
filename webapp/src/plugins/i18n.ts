import { createI18n } from 'vue-i18n';
import en from '../locales/en.json';
import pl from '../locales/pl.json';
import ua from '../locales/ua.json';

export default createI18n({
  // legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    pl,
    ua,
  }
});
