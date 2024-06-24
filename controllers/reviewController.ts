import { Request, Response } from 'express';
import Review, { ReviewDocument } from '../models/Review';
import { getUserId } from '../utils/sessionUtils';

// Dodawanie recenzji
export const addReview = async (req: Request, res: Response) => {
    const { book, rating, reviewText } = req.body;
    const user = getUserId(req); // Zakładamy, że identyfikator użytkownika jest przechowywany w req.user

    try {
        const newReview: ReviewDocument = new Review({
            book,
            user,
            rating,
            reviewText,
        });

        await newReview.save();

        return res.status(201).json({ msg: 'Review added successfully', review: newReview });
    } catch (err) {
        console.error('Error adding review:', err);
        return res.status(500).json({ msg: 'Server Error' });
    }
};

// Pobieranie recenzji dla konkretnej książki
export const getReviewsByBook = async (req: Request, res: Response) => {
    const { bookId } = req.params;

    try {
        const reviews = await Review.find({ book: bookId }).populate('user', 'name');

        return res.status(200).json(reviews);
    } catch (err) {
        console.error('Error fetching reviews:', err);
        return res.status(500).json({ msg: 'Server Error' });
    }
};

// Edycja recenzji
export const updateReview = async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const { rating, reviewText } = req.body;
    const user = getUserId(req);

    try {
        const review: ReviewDocument | null = await Review.findOne({ _id: reviewId, user });

        if (!review) {
            return res.status(404).json({ msg: 'Review not found or unauthorized' });
        }

        review.rating = rating;
        review.reviewText = reviewText;

        await review.save();

        return res.status(200).json({ msg: 'Review updated successfully', review });
    } catch (err) {
        console.error('Error updating review:', err);
        return res.status(500).json({ msg: 'Server Error' });
    }
};

// Usuwanie recenzji
export const deleteReview = async (req: Request, res: Response) => {
    const { reviewId } = req.params;
    const user = getUserId(req);

    try {
        const review: ReviewDocument | null = await Review.findOne({ _id: reviewId, user });

        if (!review) {
            return res.status(404).json({ msg: 'Review not found or unauthorized' });
        }

        await Review.deleteOne({ _id: reviewId, user });

        return res.status(200).json({ msg: 'Review deleted successfully' });
    } catch (err) {
        console.error('Error deleting review:', err);
        return res.status(500).json({ msg: 'Server Error' });
    }
};
