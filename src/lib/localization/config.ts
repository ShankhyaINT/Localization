import * as i18n from 'i18n';
import * as path from 'path';

interface TranslationData {
  [key: string]: string;
}

interface LocaleConfig {
  locales?: string[];
  directory?: string;
  defaultLocale?: string;
  objectNotation?: boolean;
}

class LocalizationSDK {
  private i18nConfig: LocaleConfig;

  constructor(options?: LocaleConfig) {
    const defaultOptions: LocaleConfig = {
      locales: ['en', 'fr', 'es'],
      directory: path.join(__dirname, '..', '..', 'assets', 'locales'),
      defaultLocale: 'en',
      objectNotation: true,
    };

    this.i18nConfig = { ...defaultOptions, ...options };
    i18n.configure(this.i18nConfig);
  }

  translate(key: string, locale?: string): string {
    return i18n.__({
      phrase: key,
      locale: locale || this.i18nConfig.defaultLocale,
    });
  }

  setLocale(locale: string): void {
    i18n.setLocale(locale);
  }

  getCurrentLocale(): string {
    return i18n.getLocale();
  }

  getAvailableLocales(): string[] {
    return i18n.getLocales();
  }

  getSupportedLanguages(): TranslationData {
    return i18n.getCatalog(i18n.getLocale()) as TranslationData;
  }
}

export default LocalizationSDK;
