import express from 'express';
import { placeOrder, getUserOrders, getOrderById } from '../controllers/orderController';
import { checkUser } from '../middlewares/authMiddleware';

const router = express.Router();

// Endpoint do składania zamówienia
router.post('/place', checkUser, placeOrder);

// Endpoint do pobierania wszystkich zamówień użytkownika
router.get('/user', checkUser, getUserOrders);

router.get('/:orderId', checkUser, getOrderById);

export default router;
