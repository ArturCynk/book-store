import mongoose, { Document, Schema } from 'mongoose';

// Enum Genre
enum Genre {
    Fiction = 'Fiction',
    NonFiction = 'Non-Fiction',
    Fantasy = 'Fantasy',
    ScienceFiction = 'Science Fiction',
    Mystery = 'Mystery',
    Thriller = 'Thriller',
    Romance = 'Romance',
    HistoricalFiction = 'Historical Fiction',
    Biography = 'Biography',
    Autobiography = 'Autobiography',
    SelfHelp = 'Self-Help',
    Philosophy = 'Philosophy',
    Travel = 'Travel',
    Cookbooks = 'Cookbooks',
    Poetry = 'Poetry',
    Drama = 'Drama',
    Children = 'Children',
    YoungAdult = 'Young Adult',
}

// Interfejs dla dokumentu książki
export interface BookDocument extends Document {
    title: string;
    author: string;
    description: string;
    genre: Genre; // Użyj enuma Genre
    quantity: number;
    price: number;
    publisherDate: Date;
    isbn: string;
    coverImage: string; // URL do obrazu okładki książki
    createdAt: Date;
    updatedAt: Date;
}

// Schema książki
const BookSchema: Schema<BookDocument> = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        author: {
            type: String,
            required: [true, 'Author is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        genre: {
            type: String,
            enum: Object.values(Genre),
            required: [true, 'Genre is required'],
            trim: true,
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [0, 'Quantity cannot be less than 0'],
            default: 0,
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be less than 0'],
        },
        publisherDate: {
            type: Date,
            required: [true, 'Publisher date is required'],
        },
        isbn: {
            type: String,
            required: [true, 'ISBN is required'],
            unique: true,
            trim: true,
        },
        coverImage: {
            type: String,
            required: [true, 'Cover image is required'],
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Book = mongoose.model<BookDocument>('Book', BookSchema);
export default Book;
