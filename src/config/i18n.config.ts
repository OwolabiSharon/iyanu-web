import { I18n } from 'i18n';
import path from 'path';

interface I18nConfig {
  locales: string[];
  defaultLocale: string;
  directory: string;
}

const i18nConfig: I18nConfig = {
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  directory: path.join(__dirname, '..', 'locales')
};

const i18n = new I18n(i18nConfig);

export default i18n;