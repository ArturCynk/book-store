import { Request, Response } from 'express';
import Order, { OrderDocument } from '../models/Order';
import Cart, { CartDocument } from '../models/Cart';
import Book, { BookDocument } from '../models/Book';
import { getUserId } from '../utils/sessionUtils';
import { sendOrderConfirmationEmail } from '../email/sendEmail';
import User, { UserDocument } from '../models/User';

export const placeOrder = async (req: Request, res: Response) => {
    const userId = getUserId(req); // Get user ID from session

    try {
        // Find user's email
        const user = await User.findById(userId);
        if (!user || !user.email) {
            return res.status(404).json({ msg: 'User not found or email not available' });
        }

        const userEmail = user.email;

        // Find user's cart
        const cart = await Cart.findOne({ user: userId }).populate('items.book');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ msg: 'Cart is empty' });
        }

        // Create order from cart items
        const orderItems = cart.items.map(item => ({
            book: item.book,
            title: (item.book as any).title,
            author: (item.book as any).author,
            quantity: item.quantity,
            price: item.price
        }));

        // Calculate total price
        const totalPrice = orderItems.reduce((acc, curr) => acc + curr.quantity * curr.price, 0);

        // Create new order
        const newOrder = new Order({
            user: userId,
            items: orderItems,
            totalPrice
        });

        // Save order
        await newOrder.save();

        // Clear user's cart
        cart.items = [];
        await cart.save();

        // Send order confirmation email
        await sendOrderConfirmationEmail(userEmail, {
            orderId: newOrder._id,
            customerName: user.firstName + ' ' + user.lastName,
            customerEmail: user.email,
            total: newOrder.totalPrice,
            items: orderItems
        });

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
    const { orderId } = req.params;

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