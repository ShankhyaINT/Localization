import { localizationTest } from './../../controllers/testing/localization';
import { localizationValidation } from '@validations/test';
import { Router } from 'express';

const testingRouter = Router();

testingRouter.get('/localization', localizationTest);
testingRouter.post('/localization-validation', localizationValidation, localizationTest);

export { testingRouter };
