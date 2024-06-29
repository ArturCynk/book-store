import { Request, Response } from 'express';
import User, { UserDocument } from '../models/User';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users: UserDocument[] = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error});
    }
}

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { firstName, lastName, email, username, address } = req.body;

    try {
        // Find the user by ID
        const user = await User.findById({id});
    
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
        const updatedUser = await User.findByIdAndUpdate(id, {
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

export const deleteUser = async (req: Request, res:Response) => {
    const { id } = req.params;
    try {
      const user = await User.findById({id});

      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      const deletedUser = await User.findByIdAndDelete(id);
      res.json({ message: 'User deleted successfully', deletedUser });
    } catch (error) {
      res.status(400).json({ message: error});
    }
}