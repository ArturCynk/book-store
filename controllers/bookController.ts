import { Request, Response } from 'express';
import Book, { BookDocument } from '../models/Book';

// Kontroler dla dodawania nowych książek
export const addBook = async (req: Request, res: Response) => {
  const { title, author, isbn, quantity, description, price, publisherDate } = req.body;

  try {
    let existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ msg: 'Book with this ISBN already exists' });
    }

    // Tworzenie nowej instancji książki
    const coverImage = req.file ? req.file.path : ''; // Ścieżka do przesłanego zdjęcia

    const newBook: BookDocument = new Book({
      title,
      author,
      isbn,
      quantity,
      description,
      price,
      publisherDate: new Date(publisherDate),
      coverImage, // Dodanie pola coverImage
    });

    await newBook.save();

    return res.status(201).json({ msg: 'Book added successfully', book: newBook });
  } catch (err) {
    console.error('Error adding book:', err);
    return res.status(500).json({ msg: 'Server Error' });
  }
};

export const getAllBooks = async (req: Request, res: Response) => {
    try {
      const books: BookDocument[] = await Book.find();
      return res.status(200).json(books);
    } catch (err) {
      console.error('Error fetching books:', err);
      return res.status(500).json({ msg: 'Server Error' });
    }
};