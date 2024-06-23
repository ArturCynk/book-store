import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const updateProfileValidationRules = [
    body('firstName', 'First name is required').notEmpty(),
    body('lastName', 'Last name is required').notEmpty(),
    body('username', 'Username must be at least 3 characters').isLength({ min: 3 }),
    body('email', 'Valid email is required').isEmail(),
    body('address.city', 'City is required').notEmpty(),
    body('address.street', 'Street is required').notEmpty(),
    body('address.houseNumber', 'House number is required').notEmpty(),
    body('address.postalCode', 'Postal code is required').notEmpty(),
    body('address.country', 'Country is required').notEmpty(),
];

export const changePasswordValidationRules = [
  body('currentPassword', 'Current password is required').notEmpty(),
  body('newPassword', 'Password must be at least 8 characters long').isLength({ min: 8 }),
  body('newPassword', 'Password must include one lowercase letter').matches(/[a-z]/),
  body('newPassword', 'Password must include one uppercase letter').matches(/[A-Z]/),
  body('newPassword', 'Password must include one number').matches(/\d/),
  body('newPassword', 'Password must include one special character').matches(/[@$!%*?&]/),
];

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };
  