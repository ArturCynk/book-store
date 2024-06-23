import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from 'dotenv';

import connectDB from "./config/database";
import sessionMiddleware from './config/session'

import authRoutes from './routes/authRoutes'
import bookRouter from './routes/bookRoutes'
import cartRouter from './routes/cartRoutes'
import orderRoutes from './routes/orderRoutes'

const app: Application = express();

dotenv.config();

const PORT = process.env.PORT;
const MONGOURL = process.env.MONGOURL;

app.use(cors());
app.use(bodyParser.json());
app.use(sessionMiddleware);

connectDB(MONGOURL);

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRoutes)


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
