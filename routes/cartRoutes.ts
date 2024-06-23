import express from 'express';
import { addToCart, removeFromCart, clearCart, updateCartItemQuantity, getCart } from '../controllers/cartController';
import { checkUser } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/add', checkUser, addToCart);

router.delete('/remove/:bookId', checkUser, removeFromCart);

router.delete('/clear', checkUser, clearCart);

router.put('/update', checkUser, updateCartItemQuantity);

router.get('/', checkUser, getCart);

export default router;
