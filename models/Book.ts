import mongoose, { Document, Schema } from 'mongoose';

// Interfejs dla dokumentu książki
export interface BookDocument extends Document {
  title: string;
  author: string;
  isbn: string;
  quantity: number;
  description: string;
  price: number;
  publisherDate: Date;
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
    isbn: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be less than 0'],
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
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
