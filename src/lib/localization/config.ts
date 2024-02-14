import * as i18n from 'i18n';
import * as path from 'path';
import { isCelebrateError } from 'celebrate';
import { Application, NextFunction, Request, Response } from 'express';

interface TranslationData {
  [key: string]: string;
}
// This is for global state management.Global assumes we share a common state of localization in any time and any part of our app. This is usually fine in cli-style scripts. When serving responses to http requests we'll need to make sure that scope is NOT shared globally but attached to your request object.
// For mmore info visit https://www.npmjs.com/package/i18n#cli-within-global-scope
class LocalizationSDK {
  private i18nConfig: i18n.ConfigurationOptions; // Configuration options for i18n module
  public localeProvider = i18n; // Exposing i18n module for localization
  private static instance: LocalizationSDK; // Singleton instance of the LocalizationSDK class

  /**
   * Constructor function for LocalizationSDK class
   * @param options Optional configuration options for i18n module
   * @returns A new instance of the LocalizationSDK class
   */
  private constructor(options?: i18n.ConfigurationOptions) {
    // Default configuration options for i18n module
    const defaultOptions: i18n.ConfigurationOptions = {
      locales: ['en', 'fr', 'es'],
      directory: path.join(__dirname, '..', '..', 'assets', 'locales'),
      defaultLocale: 'en',
    };

    // Merging default options with provided options (if any)
    this.i18nConfig = { ...defaultOptions, ...options };
    // Configuring i18n module with merged options
    this.localeProvider.configure(this.i18nConfig);
  }

  /**
   * Method to get instance of LocalizationSDK class (Singleton pattern)
   * @param options Optional configuration options for i18n module
   * @returns An instance of the LocalizationSDK class
   */
  static getInstance(options?: i18n.ConfigurationOptions): LocalizationSDK {
    if (!LocalizationSDK.instance) {
      LocalizationSDK.instance = new LocalizationSDK(options);
    }
    return LocalizationSDK.instance;
  }

  /**
   * Method to initialize localization middleware in Express app
   * @param app Express Application instance
   * @returns void
   */
  initialize(app: Application): void {
    app.use(this.localeProvider.init);
  }

  /**
   * Method to translate a key to a specific locale or default locale
   * @param key The key to translate
   * @param locale The locale to translate the key into (optional, defaults to default locale)
   * @returns Translated string
   */
  translate(key: string, locale?: string): string {
    return this.localeProvider.__({
      phrase: key,
      locale: locale || this.i18nConfig.defaultLocale,
    });
  }

  /**
   * Method to set the current locale
   * @param locale The locale to set
   * @returns void
   */
  setLocale(locale: string): void {
    this.localeProvider.setLocale(locale);
  }

  /**
   * Getter method to get the current locale
   * @returns The current locale
   */
  get getCurrentLocale(): string {
    return this.localeProvider.getLocale();
  }

  /**
   * Method to get available locales
   * @returns An array of available locales
   */
  getAvailableLocales(): string[] {
    return this.localeProvider.getLocales();
  }

  /**
   * Method to get supported languages along with their translations
   * @returns A dictionary of supported languages and their translations
   */
  getSupportedLanguages(): TranslationData {
    return this.localeProvider.getCatalog(this.localeProvider.getLocale()) as TranslationData;
  }

  /**
   * Method to handle validation errors
   * @param err The error object
   * @param req The Express request object
   * @param res The Express response object
   * @param next The Express next function
   * @returns void
   */
  manageValidationError(err: Error, req: Request, res: Response, next: NextFunction): void {
    if (isCelebrateError(err)) {
      // Checking if the error is a celebrate validation error
      const validationMessage = 'celebrate request validation failed';
      res.locals.error = res.__(validationMessage); // Setting localized error message in response locals
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const respObject: any = {
        // Creating response object for validation error
        statusCode: 400,
        error: 'Bad Request',
        message: res.__(validationMessage),
        validation: {},
      };
      // Iterating through validation error details
      err.details.forEach((value, item) => {
        // Constructing validation error object
        respObject['validation'][item] = {
          source: `${item}`,
          keys: value?.details?.[0]?.['path'],
          message: value?.details?.[0]?.['message'],
        };
        // Localizing error message if available
        if (value?.details?.[0]?.['message']) {
          const message = value?.details?.[0]?.['message'];
          res.locals.error = res.__(message);
          respObject['validation'][item]['message'] = res.__(message);
        }
      });
      // Sending validation error response
      res.status(400).json(respObject);
    } else {
      next(err); // Forwarding error to the next middleware
    }
  }
}

export default LocalizationSDK; // Exporting LocalizationSDK class as default
