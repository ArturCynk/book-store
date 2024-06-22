import session from 'express-session';
import mongoose from 'mongoose';
import connectMongo from 'connect-mongodb-session';
import dotenv from 'dotenv';
dotenv.config();

const MongoStore = connectMongo(session);

const uri = process.env.MONGOURL; // Your MongoDB URI

if (!uri) {
  throw new Error('MongoDB URI is not provided in environment variables');
}

const storeOptions = {
  uri: uri,
  collection: 'sessions',
};

const sessionStore = new MongoStore(storeOptions);

const sessionMiddleware = session({
  secret: 'secret-key-for-session',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 1,
    httpOnly: true,
    secure: false,
  },
});

export default sessionMiddleware;
