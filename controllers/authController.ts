import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User, { UserDocument } from '../models/User';
import { sendActivationEmail, sendPasswordResetEmail } from '../email/sendEmail';
import { setUserId } from '../utils/sessionUtils';
import { ObjectId } from 'mongodb';

// Controller function for user registration
export const registerUser = async (req: Request, res: Response) => {
  const { firstName, lastName, username, email, password, address } = req.body;

  try {
    // Check if user with the same email or username already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user instance
    const newUser: UserDocument = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      address,
      isActive: false, // Initially set to inactive
    });

    // Save the new user to the database
    await newUser.save();

    // Generate activation token using JWT
    const activationToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET as string, {
      expiresIn: '24h', // Token expires in 24 hours
    });

    // Assign activation token to the user and save again
    newUser.activationToken = activationToken;
    await newUser.save();

    // Send activation email with activation link
    const activationLink = `http://localhost:3000/activate/${activationToken}`;
    await sendActivationEmail(email, activationLink);

    return res.status(201).json({ msg: 'User registered successfully' });

  } catch (err) {
    console.error('Error registering user:', err);
    return res.status(500).send('Server Error');
  }
};

// Controller function to activate user account
export const activateAccount = async (req: Request, res: Response) => {
  const { token } = req.params;

  if (token) {
    try {
      // Verify the activation token
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

      // Find the user by decoded userId
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Check if the account is already activated
      if (user.isActive) {
        return res.status(400).json({ error: 'Account already activated' });
      }

      // Activate the user account
      user.isActive = true;
      await user.save();

      return res.status(200).json({ message: 'Account successfully activated.' });
    } catch (error) {
      console.error('Error verifying activation token:', error);
      return res.status(400).json({ error: 'Invalid or expired activation token.' });
    }
  } else {
    return res.status(400).json({ error: 'Missing activation token.' });
  }
};

// Controller function for user login
export const loginUser = async (req: Request, res: Response) => {
  const { usernameOrEmail, password } = req.body;

  try {
    // Find user by username or email
    let user: UserDocument | null = await User.findOne({ $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }] });
    if (!user) {
      return res.status(404).json({ msg: 'Account not found' });
    }

    // Check if the account is activated
    if (!user.isActive) {
      return res.status(401).json({ msg: 'Account not activated' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid password' });
    }

    // Set userId in session
    let userId: ObjectId;
    if (typeof user._id === 'string') {
      userId = new ObjectId(user._id);
    } else {
      userId = user._id as ObjectId;
    }
    setUserId(req, userId);

    // Respond with success message
    return res.json({ msg: 'Login successful' });
  } catch (err) {
    console.error('Error logging in:', err);
    return res.status(500).json({ msg: 'Server Error' });
  }
};

// Funkcja do wysyłania emaila z linkiem resetowania hasła
export const sendResetPasswordEmail = async (req: Request, res: Response) => {
    const { email } = req.body;
  
    try {
      // Sprawdź, czy istnieje użytkownik o podanym emailu
      const user: UserDocument | null = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      // Wygeneruj token resetowania hasła
      const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_RESET_SECRET as string, {
        expiresIn: '30m', // Ważność tokena resetowania hasła (30 minut)
      });
  
      // Zapisz token resetowania hasła w bazie danych
      user.resetPasswordToken = resetToken;
      await user.save();
  
      // Wygeneruj link do resetowania hasła
      const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
  
      // Wyślij email z linkiem resetowania hasła
      await sendPasswordResetEmail(email, resetLink);
  
      return res.json({ msg: 'Password reset email sent' });
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return res.status(500).json({ msg: 'Server Error' });
    }
  };
  
// Funkcja do resetowania hasła na podstawie otrzymanego tokena
export const resetPassword = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { newPassword } = req.body;
  
    if (!token) {
      return res.status(400).json({ msg: 'Invalid token' });
    }
  
    try {
      // Sprawdź, czy token resetowania hasła jest poprawny
      const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET as string) as { userId: string };
  
      // Znajdź użytkownika na podstawie ID
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      // Zaktualizuj hasło użytkownika
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      user.password = hashedPassword;
      user.resetPasswordToken = undefined; // Usuń token resetowania hasła
      await user.save();
  
      return res.json({ msg: 'Password reset successful' });
    } catch (error) {
      console.error('Error resetting password:', error);
      return res.status(400).json({ msg: 'Invalid or expired token' });
    }
  };