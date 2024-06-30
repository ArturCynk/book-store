import { Request, Response } from 'express';
import ExcelJS from 'exceljs';
import bcrypt from 'bcryptjs';
import User, { UserDocument } from '../models/User';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users: UserDocument[] = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error});
    }
}

export const getUser = async (req: Request, res: Response) => {
  const {id} = req.params

  try {
      // Fetch user from the database based on their ID
      const user = await User.findById(id);
  
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

export const searchUsers = async (req: Request, res: Response) => {
  const { query } = req.query;

  try {
    const users = await User.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } }, // Wyszukaj po imieniu (ignoruj wielkość liter)
        { lastName: { $regex: query, $options: 'i' } },  // Wyszukaj po nazwisku (ignoruj wielkość liter)
        { username: { $regex: query, $options: 'i' } },  // Wyszukaj po nazwie użytkownika (ignoruj wielkość liter)
        { email: { $regex: query, $options: 'i' } },     // Wyszukaj po adresie e-mail (ignoruj wielkość liter)
      ],
    });

    res.json(users);
  } catch (error) {
    console.error('Error while searching users:', error);
    res.status(500).json({ message: 'An error occurred while searching users.' });
  }
};


export const sortUser =  async (req: Request, res: Response) => {
  const { sortBy } = req.query; 

  try {
    let users: UserDocument[];

    if (sortBy && ['firstName', 'lastName', 'email', 'createdAt', 'role'].includes(sortBy as string)) {
      users = await User.find().sort({ [sortBy as string]: 1 }).exec();
    } else {
      users = await User.find().sort({ lastName: 1 }).exec();
    }

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while sorting users.' });
  }
};

export const exportUsersToExcel = async (req: Request, res: Response) => {
  try {
      const users = await User.find();

      // Create a workbook and add a worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Users');

      // Define the columns
      worksheet.columns = [
          { header: 'First Name', key: 'firstName', width: 20 },
          { header: 'Last Name', key: 'lastName', width: 20 },
          { header: 'Email', key: 'email', width: 40 },
          { header: 'Username', key: 'username', width: 20 },
          { header: 'Address', key: 'address', width: 40 },
          { header: 'Role', key: 'role', width: 15 },
          { header: 'Created At', key: 'createdAt', width: 20 },
          { header: 'Updated At', key: 'updatedAt', width: 20 },
      ];

      // Add rows to the worksheet
      users.forEach((user: UserDocument) => {
          worksheet.addRow({
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              username: user.username,
              address: `${user.address.street}. ${user.address.houseNumber}, ${user.address.apartmentNumber}, ${user.address.city}, ${user.address.postalCode}, ${user.address.country}`,
              role: user.role,
              createdAt: user.createdAt.toLocaleString(),
              updatedAt: user.updatedAt.toLocaleString(),
          });
      });

      // Set the content type and disposition of the response
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');

      // Write the workbook to the response
      await workbook.xlsx.write(res);
      res.end();
  } catch (error) {
      console.error('Error exporting users to Excel:', error);
      res.status(500).json({ message: 'An error occurred while exporting users to Excel.' });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  const { id } = req.params
  const { currentPassword, newPassword } = req.body;

  try {
    let user: UserDocument | null;
    
    user = await User.findById(id);

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
