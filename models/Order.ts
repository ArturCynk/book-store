import mongoose, { Document, Schema } from 'mongoose';

export interface OrderItem {
    book: mongoose.Types.ObjectId; // Poprawiono na mongoose.Types.ObjectId
    quantity: number;
    price: number;
}

export interface OrderDocument extends Document {
    user: mongoose.Types.ObjectId;
    items: OrderItem[];
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema<OrderItem>({
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
});

const OrderSchema = new Schema<OrderDocument>({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema],
    totalPrice: { type: Number, required: true },
}, { timestamps: true });

const Order = mongoose.model<OrderDocument>('Order', OrderSchema);

export default Order;
