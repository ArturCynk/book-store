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

export const deleteUser = async (req: Request, res:Response) => {
    const { id } = req.params;
    try {
      const deletedUser = await User.findByIdAndDelete(id);
      res.json({ message: 'User deleted successfully', deletedUser });
    } catch (error) {
      res.status(400).json({ message: error});
    }
}