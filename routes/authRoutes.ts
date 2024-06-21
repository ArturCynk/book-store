import express from 'express';
import { registerUser, activateAccount, loginUser, sendResetPasswordEmail, resetPassword } from '../controllers/authController';
import { registrationValidationRules, loginValidationRules, validate } from '../validations/authValidation';

const router = express.Router();

// Route for user registration
router.post('/register', registrationValidationRules, validate, registerUser);

// Route for account activation
router.get('/activate/:token', activateAccount);

// Route for user login
router.post('/login', loginValidationRules, validate, loginUser);

// Endpoint do wysyłania emaila z linkiem resetowania hasła
router.post('/reset-password', sendResetPasswordEmail);

// Endpoint do resetowania hasła na podstawie otrzymanego tokena
router.post('/reset-password/:token', resetPassword);

export default router;
