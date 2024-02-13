import { Router } from 'express';
import { authRouter } from './auth';
import { userRouter } from './user';
import { testingRouter } from './testing';

const v1Router = Router();

v1Router.use('/auth', authRouter);
v1Router.use('/user', userRouter);
v1Router.use('/test', testingRouter);
// All routes go here

export { v1Router };
