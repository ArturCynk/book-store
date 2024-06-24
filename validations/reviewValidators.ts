import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateReview = [
    body('book').isMongoId().withMessage('Invalid book ID'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('reviewText').not().isEmpty().withMessage('Review text is required'),
];

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };