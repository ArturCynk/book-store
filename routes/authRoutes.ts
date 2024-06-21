import express from 'express';
import { registerUser, activateAccount, loginUser } from '../controllers/authController';
import { registrationValidationRules, loginValidationRules, validate } from '../validations/authValidation';

const router = express.Router();

// Route for user registration
router.post('/register', registrationValidationRules, validate, registerUser);

// Route for account activation
router.get('/activate/:token', activateAccount);

// Route for user login
router.post('/login', loginValidationRules, validate, loginUser);

export default router;
