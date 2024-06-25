import { Request, Response } from 'express';
import Favorite, { FavoriteDocument } from '../models/Favorite';
import { getUserId } from '../utils/sessionUtils';

// Dodawanie książki do ulubionych
export const addFavorite = async (req: Request, res: Response) => {
    const { bookId } = req.body;
    const user = getUserId(req);

    try {
        const existingFavorite: FavoriteDocument | null = await Favorite.findOne({ user, book: bookId });

        if (existingFavorite) {
            return res.status(400).json({ msg: 'Book is already in favorites' });
        }

        const newFavorite: FavoriteDocument = new Favorite({
            user,
            book: bookId,
        });

        await newFavorite.save();

        return res.status(201).json({ msg: 'Book added to favorites successfully', favorite: newFavorite });
    } catch (err) {
        console.error('Error adding book to favorites:', err);
        return res.status(500).json({ msg: 'Server Error' });
    }
};

// Pobieranie ulubionych książek użytkownika
export const getFavorites = async (req: Request, res: Response) => {
    const user = getUserId(req);

    try {
        const favorites = await Favorite.find({ user }).populate('book');

        return res.status(200).json(favorites);
    } catch (err) {
        console.error('Error fetching favorites:', err);
        return res.status(500).json({ msg: 'Server Error' });
    }
};

// Usuwanie książki z ulubionych
export const removeFavorite = async (req: Request, res: Response) => {
    const { favoriteId } = req.params;
    const user = getUserId(req);

    try {
        const favorite: FavoriteDocument | null = await Favorite.findOne({ _id: favoriteId, user });

        if (!favorite) {
            return res.status(404).json({ msg: 'Favorite not found or unauthorized' });
        }

        await favorite.deleteOne();

        return res.status(200).json({ msg: 'Book removed from favorites successfully' });
    } catch (err) {
        console.error('Error removing book from favorites:', err);
        return res.status(500).json({ msg: 'Server Error' });
    }
};
