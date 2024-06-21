import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from 'dotenv';

import connectDB from "./config/database";

import authRoutes from './routes/authRoutes'

const app : Application = express();

dotenv.config();

const PORT = process.env.PORT;
const MONGOURL = process.env.MONGOURL;

app.use(cors());
app.use(bodyParser.json());

connectDB(MONGOURL)

app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
    
})

