import { Request, Response } from 'express';

import { controller } from '@config/controller/controller';

export const localizationTest = controller(async (req: Request, res: Response): Promise<void> => {
  res.send({ status: res.__('healthCheck') });
});

export const localizationValidationCheck = controller(
  async (req: Request, res: Response): Promise<void> => {
    const body = req.body;
    res.send({ status: res.__(body.text) });
  },
);
