import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger'

import connectDB from "./config/database";
import sessionMiddleware from './config/session'

import authRoutes from './routes/authRoutes'
import bookRouter from './routes/bookRoutes'
import cartRouter from './routes/cartRoutes'
import orderRoutes from './routes/orderRoutes'
import userRoutes from './routes/userRoutes'
import favoriteRoutes from './routes/favoriteRoutes'
import reviewRoutes from './routes/reviewRoutes'

const app: Application = express();

dotenv.config();

const PORT = process.env.PORT;
const MONGOURL = process.env.MONGOURL;

app.use(cors());
app.use(bodyParser.json());
app.use(sessionMiddleware);

connectDB(MONGOURL);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRoutes);
app.use('/api/user', userRoutes);
app.use('/api/favorive/', favoriteRoutes);
app.use('/api/review/', reviewRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
