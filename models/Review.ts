import mongoose, { Document, Schema } from 'mongoose';
import { BookDocument } from './Book';

// Interfejs dla dokumentu recenzji
export interface ReviewDocument extends Document {
    book: mongoose.Types.ObjectId | BookDocument;
    user: mongoose.Types.ObjectId;
    rating: number;
    reviewText: string;
    createdAt: Date;
    updatedAt: Date;
}

// Schema recenzji
const ReviewSchema: Schema<ReviewDocument> = new Schema(
    {
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        reviewText: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Review = mongoose.model<ReviewDocument>('Review', ReviewSchema);
export default Review;
