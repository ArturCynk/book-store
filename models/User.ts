import mongoose, { Document, Schema } from 'mongoose';

// Interfejs dla adresu użytkownika
interface Address {
  city: string;
  street: string;
  houseNumber: string;
  apartmentNumber?: string;
  postalCode: string;
  country: string;
}

// Interfejs dla dokumentu użytkownika
export interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  address: Address;
  isActive: boolean;
  activationToken?: string;
  resetPasswordToken?: string;
  createdAt: Date;
  updatedAt: Date;
  role: 'user' | 'admin'; // Dodajemy pole role
}

// Schema użytkownika
const UserSchema: Schema<UserDocument> = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    address: {
      city: { type: String, required: [true, 'City is required'] },
      street: { type: String, required: [true, 'Street is required'] },
      houseNumber: { type: String, required: [true, 'House number is required'] },
      apartmentNumber: { type: String },
      postalCode: { type: String, required: [true, 'Postal code is required'] },
      country: { type: String, required: [true, 'Country is required'] },
    },
    isActive: {
      type: Boolean,
      default: false, // Domyślnie isActive będzie ustawione na false
    },
    activationToken: String,
    resetPasswordToken: String,
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user', // Domyślnie nowy użytkownik będzie miał rolę 'user'
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<UserDocument>('User', UserSchema);
export default User;
