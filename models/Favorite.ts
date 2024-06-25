import mongoose, { Document, Schema } from 'mongoose';
import { UserDocument } from './User';
import { BookDocument } from './Book';

// Interfejs dla dokumentu ulubionych
export interface FavoriteDocument extends Document {
    user: mongoose.Types.ObjectId | UserDocument;
    book: mongoose.Types.ObjectId | BookDocument;
    createdAt: Date;
    updatedAt: Date;
}

// Schema ulubionych
const FavoriteSchema: Schema<FavoriteDocument> = new Schema(
    {
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        book: {
            type: mongoose.Types.ObjectId,
            ref: 'Book',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Favorite = mongoose.model<FavoriteDocument>('Favorite', FavoriteSchema);
export default Favorite;
