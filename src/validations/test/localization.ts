import { celebrate, Joi } from 'celebrate';

export const localizationValidation = celebrate({
  body: Joi.object({
    text: Joi.string().required(),
  }),
});
