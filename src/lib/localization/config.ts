import * as i18n from 'i18n';
import * as path from 'path';
import { isCelebrateError } from 'celebrate';
import { Application, NextFunction, Request, Response } from 'express';

interface TranslationData {
  [key: string]: string;
}

interface LocaleConfig extends i18n.ConfigurationOptions {
  validationMessage?: string;
}

class LocalizationSDK {
  private i18nConfig: LocaleConfig;
  public localeProvider = i18n;
  private static instance: LocalizationSDK;

  constructor(options?: LocaleConfig) {
    const defaultOptions: LocaleConfig = {
      locales: ['en', 'fr', 'es'],
      directory: path.join(__dirname, '..', '..', 'assets', 'locales'),
      defaultLocale: 'en',
    };

    this.i18nConfig = { ...defaultOptions, ...options };
    this.localeProvider.configure(this.i18nConfig);
  }

  static getInstance(options?: i18n.ConfigurationOptions): LocalizationSDK {
    if (!LocalizationSDK.instance) {
      LocalizationSDK.instance = new LocalizationSDK(options);
    }
    return LocalizationSDK.instance;
  }

  initialize(app: Application) {
    app.use(this.localeProvider.init);
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

  manageValidationError(err: Error, req: Request, res: Response, next: NextFunction) {
    if (isCelebrateError(err)) {
      console.log(err);
      const validationMessage = 'celebrate request validation failed';
      res.locals.error = res.__(validationMessage);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const respObject: any = {
        statusCode: 400,
        error: 'Bad Request',
        message: res.__(validationMessage),
        validation: {},
      };
      err.details.forEach((value, item) => {
        console.log(value);
        console.log(item);
        respObject['validation'][item] = {
          source: `${item}`,
          keys: value?.details?.[0]?.['path'],
          message: value?.details?.[0]?.['message'],
        };
        if (value?.details?.[0]?.['message']) {
          const message = value?.details?.[0]?.['message'];
          res.locals.error = res.__(message);
          respObject['validation'][item]['message'] = res.__(message);
        }
      });
      res.status(400).json(respObject);
    } else {
      next(err);
    }
  }
}

export default LocalizationSDK;
