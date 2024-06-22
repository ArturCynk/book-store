import { Request, Response } from 'express';
import Book, { BookDocument } from '../models/Book';

// Kontroler dla dodawania nowych książek
export const addBook = async (req: Request, res: Response) => {
  const { title, author, isbn, quantity, description, price, publisherDate, } = req.body;

  try {
    let existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ msg: 'Book with this ISBN already exists' });
    }

    // Tworzenie nowej instancji książki
    const newBook: BookDocument = new Book({
      title,
      author,
      isbn,
      quantity,
      description,
      price,
      publisherDate: new Date(publisherDate)
    });

    await newBook.save();

    return res.status(201).json({ msg: 'Book added successfully', book: newBook });
  } catch (err) {
    console.error('Error adding book:', err);
    return res.status(500).json({ msg: 'Server Error' });
  }
};
