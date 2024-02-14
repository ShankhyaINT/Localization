# NodeJs REST API Structure

This repository is used for the REST APIs

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [NodeJs](https://nodejs.org/en/download/package-manager/)
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB](https://www.mongodb.com/)

### Installing

A step by step series of examples that tell you how to get a development env running

Clone the git repository

```
git clone <URL>
```

Install all dependency packages

```
npm install
```

Create a .env file in the root directory as described on `.env.template` file

**NPM scripts and their usage**

To clear the build directory run

```
npm run clean
```

To copy assets to the build directory run

```
npm run copy-assets
```

To list down all listing error and fix auto fixable linting error run

```
npm run lint
```

To compile all the node project

```
npm run tsc
```

For creating a build run

```
npm run build
```

To start the NodeJs server with new build and without watch run

```
npm run dev:start
```

To start the NodeJs server with new build and watch run

```
npm run dev
```

To start the NodeJs server with the existing build and without a watch

```
npm run start
```

To attach debugger with nodemon use (See the `.vscode/launch.json` for debugger options)

```
npm run dev:debug
```
To create documentation run 

```
npm run doc
```

After a creating the .env file and executing a start script a nodejs server will be running on your defined port

**Swagger Documentation**
After starting the nodejs server the swagger documentation will be accessable via `http://localhost:<YOUR_DEFINED_PORT>/api-docs`

### Run Unit Test Cases

N/A

## Deployment

N/A
# LocalizationSDK Class

The `LocalizationSDK` class provides localization functionality for an Express.js application using the i18n module. It facilitates translation of strings, setting and retrieving locale information, initializing localization middleware, and handling validation errors.

## Constructor

### `constructor(options?: i18n.ConfigurationOptions): LocalizationSDK`

- Creates a new instance of the `LocalizationSDK` class with optional configuration options.

  - `options`: Optional configuration options for the i18n module.

## Methods

### `getInstance(options?: i18n.ConfigurationOptions): LocalizationSDK`

- Gets a singleton instance of the `LocalizationSDK` class.

  - `options`: Optional configuration options for the i18n module.

### `initialize(app: Application): void`

- Initializes localization middleware in an Express application.

  - `app`: Express `Application` instance.

### `translate(key: string, locale?: string): string`

- Translates a given key to the specified locale or the default locale.

  - `key`: The key to translate.
  - `locale`: Optional. The locale to translate the key into. Defaults to the default locale.
  
- Returns the translated string.

### `setLocale(locale: string): void`

- Sets the current locale.

  - `locale`: The locale to set.

### `getCurrentLocale: string`

- Gets the current locale.

- Returns the current locale as a string.

### `getAvailableLocales(): string[]`

- Retrieves an array of available locales.

- Returns an array of available locales as strings.

### `getSupportedLanguages(): TranslationData`

- Retrieves supported languages along with their translations.

- Returns a dictionary of supported languages and their translations.

### `manageValidationError(err: Error, req: Request, res: Response, next: NextFunction): void`

- Handles validation errors, particularly celebrate validation errors.

  - `err`: The error object.
  - `req`: The Express request object.
  - `res`: The Express response object.
  - `next`: The Express next function.
  
- Sends a JSON response containing details of the validation error.

## Properties

### `localeProvider: i18n`

- Exposes the i18n module for localization functionality.

### `i18nConfig: i18n.ConfigurationOptions`

- Configuration options for the i18n module.

## Interfaces

### `TranslationData`

- Represents a dictionary of translation data, where each key is a string and each value is a translated string.

## Dependencies

- `i18n`: Module for localization functionality.
- `path`: Module for working with file paths.
- `celebrate`: Module for request validation in Express applications.
- `express`: Web framework for Node.js applications.

## Example Usage

```typescript
import express from 'express';
import LocalizationSDK from './LocalizationSDK';

// Initialize Express app
const app = express();

// Initialize LocalizationSDK
const localizationSDK = LocalizationSDK.getInstance();

// Initialize localization middleware
localizationSDK.initialize(app);

// Route to handle translation
app.get('/translate/:key', (req, res) => {
  const { key } = req.params;
  const translatedString = localizationSDK.translate(key);
  res.send(translatedString);
});

// Set locale
app.get('/setLocale/:locale', (req, res) => {
  const { locale } = req.params;
  localizationSDK.setLocale(locale);
  res.send('Locale set successfully');
});

// Start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
