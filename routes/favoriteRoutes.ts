import express from 'express';
import { addFavorite, getFavorites, removeFavorite } from '../controllers/favoriteController';
import { checkUser } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * /favorites:
 *   post:
 *     summary: Add a book to favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *             required:
 *               - bookId
 *     responses:
 *       201:
 *         description: Book added to favorites successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 favorite:
 *                   $ref: '#/components/schemas/Favorite'
 *       400:
 *         description: Book is already in favorites
 *       500:
 *         description: Server Error
 */
router.post('/favorites', checkUser, addFavorite);

/**
 * @swagger
 * /favorites:
 *   get:
 *     summary: Get user's favorite books
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of favorite books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Favorite'
 *       500:
 *         description: Server Error
 */
router.get('/favorites', checkUser, getFavorites);

/**
 * @swagger
 * /favorites/{favoriteId}:
 *   delete:
 *     summary: Remove a book from favorites
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: favoriteId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book removed from favorites successfully
 *       404:
 *         description: Favorite not found or unauthorized
 *       500:
 *         description: Server Error
 */
router.delete('/favorites/:favoriteId', checkUser, removeFavorite);

export default router;
