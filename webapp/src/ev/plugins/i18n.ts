import {createI18n} from 'vue-i18n';
import en from '../locales/en.json';
import pl from '../locales/pl.json';
import common_en from '../locales/common_en.json';
import common_pl from '../locales/common_pl.json';

export default createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: Object.assign(en, common_en),
    pl: Object.assign(pl, common_pl)
  }
});
