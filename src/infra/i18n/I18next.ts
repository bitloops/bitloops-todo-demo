import i18next from 'i18next';
import { Ii18nProvider } from '.';

class I18Next implements Ii18nProvider {
  private language: string;
  private translations: any;

  constructor(language: string, translations: any) {
    this.language = language;
    this.translations = translations;
    i18next.init({
      compatibilityJSON: 'v3',
      lng: this.language, // if you're using a language detector, do not define the lng option
      debug: true,
      resources: this.translations,
    });
  }

  t(key: string) {
    return i18next.t(key);
  }

  changeLanguage(language: string, callback?: any) {
    i18next.changeLanguage(language, callback);
  }
}

export default I18Next;
