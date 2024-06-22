import { Request, Response, NextFunction } from 'express';
import User, { UserDocument } from '../models/User'; 
import { getUserId } from '../utils/sessionUtils'

// Middleware sprawdzający autoryzację
export const checkAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const userId = getUserId(req);

  if (!userId) {
    return res.status(401).json({ msg: 'Unauthorized' }); // Brak autoryzacji - brak userId w sesji
  }

  try {
    const user: UserDocument | null = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ msg: 'Unauthorized' }); // Brak autoryzacji - użytkownik nie istnieje w bazie
    }

    // Sprawdzenie czy użytkownik jest administratorem
    if (!(user.role === 'admin')) {
      return res.status(403).json({ msg: 'Forbidden' }); // Brak uprawnień administratora
    }


    next(); // Kontynuuj wykonanie jeśli użytkownik jest zalogowany i jest administratorem
  } catch (err) {
    console.error('Error checking admin role:', err);
    res.status(500).json({ msg: 'Server Error' }); // Błąd serwera
  }
};
