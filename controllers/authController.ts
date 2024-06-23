import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User, { UserDocument } from '../models/User';
import { sendActivationEmail, sendPasswordResetEmail } from '../email/sendEmail';
import { setUserId, clearUserId } from '../utils/sessionUtils';
import { ObjectId } from 'mongodb';

// Controller function for user registration
export const registerUser = async (req: Request, res: Response) => {
    const { firstName, lastName, username, email, password, address } = req.body;
  
    try {
      // Sprawdzamy, czy istnieje użytkownik o podanym emailu lub nazwie użytkownika
      let user = await User.findOne({ $or: [{ email }, { username }] });
  
      // Jeśli użytkownik już istnieje, zwracamy błąd
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }
  
      // Hashujemy hasło przed zapisaniem do bazy danych
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Tworzymy nowy obiekt użytkownika
      const newUser: UserDocument = new User({
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        address,
        isActive: false, // Początkowo ustawiamy na nieaktywne
        role: 'user', // Domyślnie ustawiamy rolę na 'user'
      });
  
      // Jeśli nie ma jeszcze żadnego użytkownika, ustawiamy go jako administratora
      const isFirstUser = await User.countDocuments({}) === 0;
      if (isFirstUser) {
        newUser.role = 'admin';
      }
  
      // Zapisujemy nowego użytkownika do bazy danych
      await newUser.save();
  
      // Generujemy token aktywacyjny za pomocą JWT
      const activationToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET as string, {
        expiresIn: '24h', // Token wygasa po 24 godzinach
      });
  
      // Przypisujemy token aktywacyjny do użytkownika i zapisujemy ponownie
      newUser.activationToken = activationToken;
      await newUser.save();
  
      // Wysyłamy email aktywacyjny z linkiem aktywacyjnym
      const activationLink = `http://localhost:3000/activate/${activationToken}`;
      await sendActivationEmail(email, activationLink);
  
      // Zwracamy sukces po zarejestrowaniu użytkownika
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
                
        return res.json({ msg: 'Login successful' });
    } catch (err) {
        console.error('Error logging in:', err);
        return res.status(500).json({ msg: 'Server Error' });
    }
};

// Function to send password reset email
export const sendResetPasswordEmail = async (req: Request, res: Response) => {
    const { email } = req.body;
    
    try {
        // Check if user with the provided email exists
        const user: UserDocument | null = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        // Generate password reset token
        const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, {
            expiresIn: '30m', // Token validity (30 minutes)
        });
        
        // Save reset password token to database
        user.resetPasswordToken = resetToken;
        await user.save();
        
        // Generate password reset link
        const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
        
        // Send password reset email with the reset link
        await sendPasswordResetEmail(email, resetLink);
        
        return res.json({ msg: 'Password reset email sent' });
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return res.status(500).json({ msg: 'Server Error' });
    }
};

// Function to reset password based on received token
export const resetPassword = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    
    if (!token) {
        return res.status(400).json({ msg: 'Invalid token' });
    }
    
    try {
        // Verify if the reset password token is valid
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        
        // Find user based on the decoded userId
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        
        // Update user's password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        user.password = hashedPassword;
        user.resetPasswordToken = undefined; // Clear reset password token
        await user.save();
        
        return res.json({ msg: 'Password reset successful' });
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(400).json({ msg: 'Invalid or expired token' });
    }
};

export const logoutUser = (req: Request, res: Response) => {
    clearUserId(req);
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({ msg: 'Server Error' });
      }
      res.clearCookie('connect.sid'); // Adjust the cookie name if necessary
      return res.json({ msg: 'Logout successful' });
    });
};
