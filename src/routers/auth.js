import { Router } from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { loginSchema, registerUserSchema } from '../validation/auth.js';
import {
  loginController,
  registerUserController,
  logoutController,
  refreshController,
} from '../controllers/auth.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

router.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));
router.post('/logout', ctrlWrapper(logoutController));
router.post('/refresh', ctrlWrapper(refreshController));

export default router;