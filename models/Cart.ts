import mongoose, { Document, Schema } from 'mongoose';
import { BookDocument } from './Book';

interface CartItem {
  book: BookDocument['_id'];
  quantity: number;
  price: number;
}

export interface CartDocument extends Document {
  user: mongoose.Types.ObjectId;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<CartItem>({
  book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
});

const CartSchema = new Schema<CartDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [CartItemSchema],
}, { timestamps: true });

const Cart = mongoose.model<CartDocument>('Cart', CartSchema);

export default Cart;
