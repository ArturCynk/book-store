import express from 'express';
import { registerUser } from '../controllers/authController';
import { registrationValidationRules, validate } from '../validations/authValidation';

const router = express.Router();

router.post('/register', registrationValidationRules, validate, registerUser);

export default router;
