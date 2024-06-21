import express from 'express';
import { registerUser } from '../controllers/authController';
import { registrationValidationRules } from '../validations/authValidation';

const router = express.Router();

router.post('/register', registrationValidationRules, registerUser);

export default router;
