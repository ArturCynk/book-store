import express from 'express';
import { placeOrder, getUserOrders, getOrderById } from '../controllers/orderController';
import { checkUser } from '../middlewares/authMiddleware';

const router = express.Router();

// Endpoint do składania zamówienia
/**
 * @swagger
 * /api/orders/place:
 *   post:
 *     summary: Place a new order
 *     description: Creates a new order based on the user's cart contents and sends an order confirmation email.
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderItem'
 *     responses:
 *       '201':
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       '400':
 *         description: Cart is empty or invalid request body
 *       '401':
 *         description: Unauthorized - user not authenticated
 *       '500':
 *         description: Server error
 */
router.post('/place', checkUser, placeOrder);

// Endpoint do pobierania wszystkich zamówień użytkownika
/**
 * @swagger
 * /api/orders/user:
 *   get:
 *     summary: Get all orders for the authenticated user
 *     description: Retrieves all orders placed by the authenticated user.
 *     tags:
 *       - Orders
 *     responses:
 *       '200':
 *         description: Successfully retrieved user orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       '401':
 *         description: Unauthorized - user not authenticated
 *       '500':
 *         description: Server error
 */
router.get('/user', checkUser, getUserOrders);

/**
 * @swagger
 * /api/orders/{orderId}:
 *   get:
 *     summary: Get an order by ID
 *     description: Retrieves an order by its ID, including detailed information about each item.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved the order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       '404':
 *         description: Order not found
 *       '500':
 *         description: Server error
 */
router.get('/:orderId', checkUser, getOrderById);

export default router;
