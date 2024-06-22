import express from 'express';
import { addBook } from "../controllers/bookController";
import { validateBook } from '../validations/bookValidators';
import { checkAdmin } from '../middlewares/authMiddleware';
import upload from '../middlewares/upload';
const router = express.Router();

// Endpoint do dodawania nowych książek
router.post('/books', checkAdmin, validateBook,upload.single('coverImage'), addBook);

export default router;
