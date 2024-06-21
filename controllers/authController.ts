import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User, { UserDocument } from '../models/User';

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
    });

    await newUser.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error registering user: ${err.message}`);
    } else {
      console.error('Unexpected error:', err);
    }
    res.status(500).send('Server Error');
  }
};
