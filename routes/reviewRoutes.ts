import express from 'express';
import { addReview, getReviewsByBook, updateReview, deleteReview } from '../controllers/reviewController';
import { validateReview, validate } from '../validations/reviewValidators';
import { checkUser } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Add a new review
 *     description: Creates a new review for a specific book.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               book:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               reviewText:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Review added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 review:
 *                   $ref: '#/components/schemas/Review'
 *       '400':
 *         description: Invalid request body
 *       '500':
 *         description: Server error
 */
router.post('/', checkUser, validateReview, validate, addReview);

/**
 * @swagger
 * /api/reviews/{bookId}:
 *   get:
 *     summary: Get reviews by book ID
 *     description: Retrieves all reviews for a specific book.
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       '500':
 *         description: Server error
 */
router.get('/:bookId', getReviewsByBook);

/**
 * @swagger
 * /api/reviews/{reviewId}:
 *   put:
 *     summary: Update a review
 *     description: Updates an existing review by its ID.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               reviewText:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 review:
 *                   $ref: '#/components/schemas/Review'
 *       '400':
 *         description: Invalid request body
 *       '404':
 *         description: Review not found or unauthorized
 *       '500':
 *         description: Server error
 */
router.put('/:reviewId', checkUser, validateReview, validate, updateReview);

/**
 * @swagger
 * /api/reviews/{reviewId}:
 *   delete:
 *     summary: Delete a review
 *     description: Deletes a review by its ID.
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Review deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *       '404':
 *         description: Review not found or unauthorized
 *       '500':
 *         description: Server error
 */
router.delete('/:reviewId', checkUser, deleteReview);

export default router;