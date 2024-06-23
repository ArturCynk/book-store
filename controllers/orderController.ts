import { Request, Response } from 'express';
import Order, { OrderDocument } from '../models/Order';
import Cart, { CartDocument } from '../models/Cart';
import Book, { BookDocument } from '../models/Book';
import { getUserId } from '../utils/sessionUtils';

// Kontroler do składania zamówienia
export const placeOrder = async (req: Request, res: Response) => {
    const userId = getUserId(req); // Pobierz ID użytkownika z sesji
    try {
        // Znajdź koszyk użytkownika
        const cart: CartDocument | null = await Cart.findOne({ user: userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ msg: 'Cart is empty' });
        }

        // Stwórz zamówienie na podstawie zawartości koszyka
        const orderItems = cart.items.map(item => ({
            book: item.book,
            quantity: item.quantity,
            price: item.price
        }));

        // Oblicz całkowitą cenę zamówienia
        const totalPrice = orderItems.reduce((acc, curr) => acc + curr.quantity * curr.price, 0);

        // Stwórz nowe zamówienie
        const newOrder = new Order({
            user: userId,
            items: orderItems,
            totalPrice
        });

        // Zapisz zamówienie
        await newOrder.save();

        // Wyczyść koszyk użytkownika
        cart.items = [];
        await cart.save();

        return res.status(201).json({ msg: 'Order placed successfully', order: newOrder });
    } catch (err) {
        console.error('Error placing order:', err);
        return res.status(500).json({ msg: 'Server Error' });
    }
};

// Kontroler do pobierania wszystkich zamówień użytkownika
export const getUserOrders = async (req: Request, res: Response) => {
    const userId = getUserId(req); // Pobierz ID użytkownika z sesji
    try {
        // Pobierz wszystkie zamówienia użytkownika
        const orders = await Order.find({ user: userId });
        return res.status(200).json({ orders });
    } catch (err) {
        console.error('Error fetching user orders:', err);
        return res.status(500).json({ msg: 'Server Error' });
    }
};


export const getOrderById = async (req: Request, res: Response) => {
    const { orderId } = req.params; // Get orderId from request params

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        // Array to store promises for fetching book details
        const itemPromises = order.items.map(async (item) => {
            const book = await Book.findById(item.book);
            if (!book) {
                throw new Error(`Book with ID ${item.book} not found`);
            }
            return {
                bookId: book._id,
                title: book.title,
                author: book.author,
                quantity: item.quantity,
                price: item.price,
            };
        });

        // Wait for all promises to resolve
        const items = await Promise.all(itemPromises);

        // Prepare and return the response
        const response = {
            _id: order._id,
            user: order.user,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            items,
        };

        return res.status(200).json({ order: response });
    } catch (err) {
        console.error('Error fetching order:', err);
        return res.status(500).json({ msg: 'Server Error' });
    }
};