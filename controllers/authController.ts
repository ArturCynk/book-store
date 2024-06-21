import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User, { UserDocument } from '../models/User'; 
import { sendActivationEmail } from '../email/sendEmail';

// Controller function for user registration
export const registerUser = async (req: Request, res: Response) => {
  const { firstName, lastName, username, email, password, address } = req.body;

  try {
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser: UserDocument = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      address,
      isActive: false, 
    });

    await newUser.save();

    const activationToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET as string, {
      expiresIn: '24h', 
    });

    newUser.activationToken = activationToken;
    await newUser.save();

    const activationLink = `http://localhost:3000/activate/${activationToken}`;
    await sendActivationEmail(email, activationLink);

    return res.status(201).json({ msg: 'User registered successfully' });

  } catch (err) {
    console.error('Error registering user:', err);
    return res.status(500).send('Server Error');
  }
};

export const activateAccount = async (req: Request, res: Response) => {
  const { token } = req.params;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.isActive) {
        return res.status(400).json({ error: 'Account already activated' });
      }

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
