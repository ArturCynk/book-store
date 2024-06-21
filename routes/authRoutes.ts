import express from 'express';
import {registerUser, activateAccount } from '../controllers/authController'
import {registrationValidationRules, validate} from '../validations/authValidation'

const router = express.Router();

// Route for user registration
router.post('/register',registrationValidationRules, validate, registerUser);

// Route for account activation
router.get('/activate/:token', activateAccount);

export default router;
