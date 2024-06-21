import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User, { UserDocument } from '../models/User';
import { sendActivationEmail } from '../email/sendEmail';

export const registerUser = async (req: Request, res: Response) => {
  const { firstName, lastName, username, email, password, address } = req.body;

  try {
    // Sprawdzenie, czy użytkownik już istnieje
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Szyfrowanie hasła
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tworzenie nowego użytkownika
    const newUser: UserDocument = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      address,
    });

    // Zapisanie użytkownika do bazy danych
    await newUser.save();

    // Wysłanie emaila aktywacyjnego
    const activationLink = `http://localhost:3000/activate?token=${newUser.activationToken}`;
    await sendActivationEmail(email, activationLink);

    // Odpowiedź sukcesu
    return res.status(201).json({ msg: 'User registered successfully' });

  } catch (err) {
    console.error('Error registering user:', err);
    // Obsługa błędów
    return res.status(500).send('Server Error');
  }
};
