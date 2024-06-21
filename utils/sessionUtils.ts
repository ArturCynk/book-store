import { Request } from 'express';
import { ObjectId } from 'mongodb';

interface SessionData {
  userId: ObjectId | null; // Lub odpowiedni typ ID dla twojej bazy danych
}

// Funkcja do ustawiania użytkownika w sesji
export const setUserId = (req: Request, userId: ObjectId): void => {
  const session = req.session as unknown as SessionData;
  session.userId = userId;
};

// Funkcja do pobierania ID użytkownika z sesji
export const getUserId = (req: Request): ObjectId | null => {
  const session = req.session as unknown as SessionData;
  return session.userId || null;
};

// Funkcja do usuwania ID użytkownika z sesji
export const clearUserId = (req: Request): void => {
  const session = req.session as unknown as SessionData;
  session.userId = null; // Lub undefined, aby usunąć wartość
};
