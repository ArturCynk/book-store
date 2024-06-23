import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Walidacja danych przy dodawaniu książki
export const validateBook = [
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('genre').notEmpty().withMessage('Genre is required'),
  body('genre').isIn([
      'Fiction', 'Non-Fiction', 'Fantasy', 'Science Fiction', 'Mystery',
      'Thriller', 'Romance', 'Historical Fiction', 'Biography', 'Autobiography',
      'Self-Help', 'Philosophy', 'Travel', 'Cookbooks', 'Poetry', 'Drama',
      'Children', 'Young Adult'
  ]).withMessage('Invalid genre'),
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a positive integer'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('publisherDate').isDate().withMessage('Invalid publisher date format'),
  body('isbn').notEmpty().withMessage('ISBN is required'),
];

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };