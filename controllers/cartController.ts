import { Request, Response } from 'express';
import Cart, { CartDocument } from '../models/Cart';
import Book, { BookDocument } from '../models/Book';
import { getUserId } from '../utils/sessionUtils';
import mongoose from 'mongoose';

export const addToCart = async (req: Request, res: Response) => {
  const { bookId, quantity } = req.body;
  const userId = getUserId(req);

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const cartItemIndex = cart.items.findIndex((item) => (item.book as mongoose.Types.ObjectId).equals(bookId));

    if (cartItemIndex !== -1) {
      cart.items[cartItemIndex].quantity += parseInt(quantity, 10);
    } else {
      const book = await Book.findById(bookId);

      if (!book) {
        return res.status(404).json({ msg: 'Book not found' });
      }

      const newCartItem = {
        book: book._id,
        quantity: parseInt(quantity, 10),
        price: book.price,
      };

      cart.items.push(newCartItem);
    }

    await cart.save();
    return res.status(200).json({ msg: 'Book added to cart successfully', cart });
  } catch (err) {
    console.error('Error adding book to cart:', err);
    return res.status(500).json({ msg: 'Server Error' });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  const { bookId } = req.params;
  const userId = getUserId(req);

  try {
    let cart = await Cart.findOne({ user: userId }) as CartDocument;

    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex((item) => (item.book as mongoose.Types.ObjectId).equals(bookId));

    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
      await cart.save();
      return res.status(200).json({ msg: 'Book removed from cart', cart });
    } else {
      return res.status(404).json({ msg: 'Book not found in cart' });
    }
  } catch (err) {
    console.error('Error removing from cart:', err);
    return res.status(500).json({ msg: 'Server Error' });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  const userId = getUserId(req);

  try {
    await Cart.deleteOne({ user: userId });
    return res.status(200).json({ msg: 'Cart cleared successfully' });
  } catch (err) {
    console.error('Error clearing cart:', err);
    return res.status(500).json({ msg: 'Server Error' });
  }
};

export const updateCartItemQuantity = async (req: Request, res: Response) => {
  const { bookId, quantity } = req.body;
  const userId = getUserId(req);

  try {
    let cart = await Cart.findOne({ user: userId }) as CartDocument;

    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    const cartItem = cart.items.find((item) => (item.book as mongoose.Types.ObjectId).equals(bookId));

    if (!cartItem) {
      return res.status(404).json({ msg: 'Item not found in cart' });
    }

    cartItem.quantity = parseInt(quantity, 10);

    await cart.save();
    return res.status(200).json({ msg: 'Cart item quantity updated successfully', cart });
  } catch (err) {
    console.error('Error updating cart item quantity:', err);
    return res.status(500).json({ msg: 'Server Error' });
  }
};

export const getCart = async (req: Request, res: Response) => {
  const userId = getUserId(req);

  if (!userId) {
    return res.status(401).json({ msg: 'User not authenticated' });
  }

  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.book');

    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    const detailedItems = cart.items.map((item) => {
      const book = item.book as BookDocument;
      return {
        bookId: book._id,
        title: book.title,
        author: book.author,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.quantity * item.price
      };
    });

    const totalCartPrice = detailedItems.reduce((total, item) => total + item.totalPrice, 0);

    return res.status(200).json({ cart: detailedItems, totalCartPrice });
  } catch (err) {
    console.error('Error fetching cart:', err);
    return res.status(500).json({ msg: 'Server Error' });
  }
};
