import { Request, Response } from 'express';
import Book, { BookDocument } from '../models/Book';

// Kontroler dla dodawania nowych książek
export const addBook = async (req: Request, res: Response) => {
    const { title, author, isbn, quantity, description, price, publisherDate, genre } = req.body;

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
            genre,
            coverImage, // Dodanie pola coverImage
        });

        await newBook.save();

        return res.status(201).json({ msg: 'Book added successfully', book: newBook });
    } catch (err) {
        console.error('Error adding book:', err);
        return res.status(500).json({ msg: 'Server Error' });
    }
};

// Kontroler do pobierania wszystkich książek
export const getAllBooks = async (req: Request, res: Response) => {
    try {
        const books: BookDocument[] = await Book.find();
        return res.status(200).json(books);
    } catch (err) {
        console.error('Error fetching books:', err);
        return res.status(500).json({ msg: 'Server Error' });
    }
};

// Kontroler do pobierania książki po ID
export const getBookById = async (req: Request, res: Response) => {
    const { id } = req.params; // Pobierz id książki z parametrów żądania

    try {
        const book: BookDocument | null = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }

        return res.status(200).json(book);
    } catch (err) {
        console.error('Error fetching book:', err);
        return res.status(500).json({ msg: 'Server Error' });
    }
};

// Kontroler do aktualizacji książki po ID
export const updateBookById = async (req: Request, res: Response) => {
    const { id } = req.params; // Pobierz id książki z parametrów żądania
    const { title, author, isbn, quantity, description, price, publisherDate, genre } = req.body;

    try {
        let book: BookDocument | null = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }

        // Aktualizacja pól książki
        book.title = title;
        book.author = author;
        book.isbn = isbn;
        book.quantity = quantity;
        book.description = description;
        book.price = price;
        book.publisherDate = publisherDate;
        book.genre = genre;

        await book.save();

        return res.status(200).json({ msg: 'Book updated successfully', book });
    } catch (err) {
        console.error('Error updating book:', err);
        return res.status(500).json({ msg: 'Server Error' });
    }
};

// Kontroler do usuwania książki po ID
export const deleteBookById = async (req: Request, res: Response) => {
    const { id } = req.params; // Pobierz id książki z parametrów żądania

    try {
        let book: BookDocument | null = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ msg: 'Book not found' });
        }

        await Book.findByIdAndDelete(id);

        return res.status(200).json({ msg: 'Book deleted successfully' });
    } catch (err) {
        console.error('Error deleting book:', err);
        return res.status(500).json({ msg: 'Server Error' });
    }
};
