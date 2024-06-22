import express from 'express';
import { addBook } from "../controllers/bookController";
import { validateBook } from '../validations/bookValidators';
import { checkAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

// Endpoint do dodawania nowych książek
router.post('/books', checkAdmin, validateBook, addBook);

export default router;
