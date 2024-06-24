import express from 'express';
import { addToCart, removeFromCart, clearCart, updateCartItemQuantity, getCart } from '../controllers/cartController';
import { checkUser } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add a book to the shopping cart
 *     description: Add a specified quantity of a book to the user's shopping cart.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: cartItem
 *         description: Book ID and quantity to add to cart
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - bookId
 *             - quantity
 *           properties:
 *             bookId:
 *               type: string
 *               description: ID of the book to add to cart
 *             quantity:
 *               type: integer
 *               description: Quantity of the book to add
 *     responses:
 *       '200':
 *         description: Book added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Success message
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 *       '400':
 *         description: Invalid request body or parameters
 *       '401':
 *         description: Unauthorized, user not authenticated
 *       '404':
 *         description: Book not found
 *       '500':
 *         description: Server error
 */
router.post('/add', checkUser, addToCart);

/**
 * @swagger
 * /api/cart/remove/{bookId}:
 *   delete:
 *     summary: Remove a book from the shopping cart
 *     description: Remove a book from the user's shopping cart by its ID.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *           description: ID of the book to remove from cart
 *     responses:
 *       '200':
 *         description: Book removed from cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Success message
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 *       '401':
 *         description: Unauthorized, user not authenticated
 *       '404':
 *         description: Book not found in cart
 *       '500':
 *         description: Server error
 */
router.delete('/remove/:bookId', checkUser, removeFromCart);

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Clear the shopping cart
 *     description: Remove all items from the user's shopping cart.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Cart cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Success message
 *       '401':
 *         description: Unauthorized, user not authenticated
 *       '500':
 *         description: Server error
 */
router.delete('/clear', checkUser, clearCart);

/**
 * @swagger
 * /api/cart/update:
 *   put:
 *     summary: Update the quantity of a book in the shopping cart
 *     description: Update the quantity of a specific book in the user's shopping cart.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: cartItem
 *         description: Book ID and new quantity to update in cart
 *         required: true
 *         schema:
 *           type: object
 *           required:
 *             - bookId
 *             - quantity
 *           properties:
 *             bookId:
 *               type: string
 *               description: ID of the book to update in cart
 *             quantity:
 *               type: integer
 *               description: New quantity of the book
 *     responses:
 *       '200':
 *         description: Cart item quantity updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Success message
 *                 cart:
 *                   $ref: '#/components/schemas/Cart'
 *       '400':
 *         description: Invalid request body or parameters
 *       '401':
 *         description: Unauthorized, user not authenticated
 *       '404':
 *         description: Book not found in cart
 *       '500':
 *         description: Server error
 */
router.put('/update', checkUser, updateCartItemQuantity);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get the shopping cart
 *     description: Retrieve the user's shopping cart with detailed information about items.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully retrieved cart details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cart:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       bookId:
 *                         type: string
 *                         description: ID of the book in cart
 *                       title:
 *                         type: string
 *                         description: Title of the book
 *                       author:
 *                         type: string
 *                         description: Author of the book
 *                       quantity:
 *                         type: integer
 *                         description: Quantity of the book in cart
 *                       price:
 *                         type: number
 *                         description: Price of the book
 *                       totalPrice:
 *                         type: number
 *                         description: Total price for this item (quantity * price)
 *                 totalCartPrice:
 *                   type: number
 *                   description: Total price of all items in the cart
 *       '401':
 *         description: Unauthorized, user not authenticated
 *       '404':
 *         description: Cart not found
 *       '500':
 *         description: Server error
 */
router.get('/', checkUser, getCart);

export default router;
