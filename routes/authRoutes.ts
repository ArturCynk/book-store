import express from 'express';
import { registerUser, activateAccount, loginUser, sendResetPasswordEmail, resetPassword, logoutUser } from '../controllers/authController';
import { registrationValidationRules, loginValidationRules, validate } from '../validations/authValidation';

const router = express.Router();

// Route for user registration
router.post('/register', registrationValidationRules, validate, registerUser);

// Route for account activation
router.get('/activate/:token', activateAccount);

// Route for user login
router.post('/login', loginValidationRules, validate, loginUser);

// Endpoint to send reset password email
router.post('/reset-password', sendResetPasswordEmail);

// Endpoint to reset password based on received token
router.post('/reset-password/:token', resetPassword);

// Route for user logout
router.post('/logout', logoutUser);

export default router;
