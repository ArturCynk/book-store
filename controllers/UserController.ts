import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User, { UserDocument } from '../models/User';
import { getUserId } from '../utils/sessionUtils'

export const getUser = async (req: Request, res: Response) => {
    const userId = getUserId(req);

    try {
        // Fetch user from the database based on their ID
        const user = await User.findById(userId);
    
        if (!user) {
          return res.status(404).json({ message: 'User not found.' });
        }
    
        // If user is found, return all their data
        return res.status(200).json({ user });
      } catch (error) {
        console.error('Error while fetching user data:', error);
        return res.status(500).json({ message: 'An error occurred while fetching user data.' });
      }
}

export const deleteUser = async (req: Request, res: Response) => {
    const userId = getUserId(req);
    
    try {
        // Find the user by ID and delete them
        const deletedUser = await User.findByIdAndDelete(userId);
    
        if (!deletedUser) {
          return res.status(404).json({ message: 'User not found.' });
        }
    
        // If user is successfully deleted, send success message
        return res.status(200).json({ message: 'User account successfully deleted.' });
    } catch (error) {
        console.error('Error while deleting user account:', error);
        return res.status(500).json({ message: 'An error occurred while deleting user account.' });
    }
}

export const updateUser = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { firstName, lastName, email, username, address } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if email is being changed and if the new email is already in use
    if (email !== user.email) {
      const emailInUse = await User.exists({ email });
      if (emailInUse) {
        return res.status(400).json({ message: 'Email is already in use.' });
      }
    }

    // Check if username is being changed and if the new username is already in use
    if (username !== user.username) {
      const usernameInUse = await User.exists({ username });
      if (usernameInUse) {
        return res.status(400).json({ message: 'Username is already taken.' });
      }
    }

    // Update user's profile and address data
    const updatedUser = await User.findByIdAndUpdate(userId, {
      firstName,
      lastName,
      email,
      username,
      address,
      updatedAt: new Date() // Optional: Update the 'updatedAt' field
    }, { new: true });

    return res.status(200).json({ message: 'User profile successfully updated.', user: updatedUser });
  } catch (error) {
    console.error('Error while updating user profile:', error);
    return res.status(500).json({ message: 'An error occurred while updating user profile.' });
  }
};


export const updatePassword = async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { currentPassword, newPassword } = req.body;

  try {
    // Pobierz użytkownika z bazy danych na podstawie jego ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Sprawdź czy podane obecne hasło jest poprawne
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    // Zahasłuj nowe hasło przed zapisaniem do bazy danych
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Zapisz zaktualizowane hasło użytkownika
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error while changing password:', error);
    return res.status(500).json({ message: 'An error occurred while changing password.' });
  }
};