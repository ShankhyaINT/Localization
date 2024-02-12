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
  public localeProvider = i18n;

  constructor(options?: LocaleConfig) {
    const defaultOptions: LocaleConfig = {
      locales: ['en', 'fr', 'es'],
      directory: path.join(__dirname, '..', '..', 'assets', 'locales'),
      defaultLocale: 'en',
      objectNotation: true,
    };

    this.i18nConfig = { ...defaultOptions, ...options };
    this.localeProvider.configure(this.i18nConfig);
  }

  translate(key: string, locale?: string): string {
    return this.localeProvider.__({
      phrase: key,
      locale: locale || this.i18nConfig.defaultLocale,
    });
  }

  setLocale(locale: string): void {
    this.localeProvider.setLocale(locale);
  }

  getCurrentLocale(): string {
    return this.localeProvider.getLocale();
  }

  getAvailableLocales(): string[] {
    return this.localeProvider.getLocales();
  }

  getSupportedLanguages(): TranslationData {
    return this.localeProvider.getCatalog(this.localeProvider.getLocale()) as TranslationData;
  }
}

export default LocalizationSDK;
