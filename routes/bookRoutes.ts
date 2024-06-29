import express from 'express';
import { getAllBooks, addBook, getBookById, updateBookById, deleteBookById, searchBooksByName, exportBooksToExcel } from '../controllers/bookController';
import { validateBook } from '../validations/bookValidators';
import { checkAdmin } from '../middlewares/authMiddleware';
import upload from '../middlewares/upload';

const router = express.Router();

// Endpoint for adding a new book
/**
 * @swagger
 * /books:
 *   post:
 *     summary: Add a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: Book added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/books', checkAdmin, validateBook, upload.single('coverImage'), addBook);

// Endpoint to get all books with sorting and filtering options
/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books with sorting and filtering
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort field (e.g., title, author)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Filter by genre
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: string
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: string
 *         description: Maximum price filter
 *       - in: query
 *         name: available
 *         schema:
 *           type: string
 *         description: Filter by availability
 *     responses:
 *       200:
 *         description: List of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Server error
 */
router.get('/books', getAllBooks);


// Endpoint to search books by title
/**
 * @swagger
 * /books/search:
 *   get:
 *     summary: Search books by title
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Title to search for
 *     responses:
 *       200:
 *         description: List of books matching the search query
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Server error
 */
router.get('/books/search', searchBooksByName);

// Endpoint to get a specific book by ID
/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.get('/books/:id', getBookById);

// Endpoint to update a book by ID
/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Updated title
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Updated author
 *       - in: query
 *         name: isbn
 *         schema:
 *           type: string
 *         description: Updated ISBN
 *       - in: query
 *         name: quantity
 *         schema:
 *           type: integer
 *         description: Updated quantity
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Updated description
 *       - in: query
 *         name: price
 *         schema:
 *           type: number
 *         description: Updated price
 *       - in: query
 *         name: publisherDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Updated publishing date
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *         description: Updated genre
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.put('/books/:id', checkAdmin, updateBookById);

// Endpoint to delete a book by ID
/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.delete('/books/:id', checkAdmin, deleteBookById);

/**
 * @swagger
 * /books/export:
 *   get:
 *     summary: Export all books to Excel
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *       500:
 *         description: Server error
 */
router.get('/bookss/export', checkAdmin, exportBooksToExcel);


export default router;
