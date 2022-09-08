import mongoose from 'mongoose';
import dotenv from "dotenv";

dotenv.config();

export const mongoConnection = () => {
    mongoose.set('debug', false);
    mongoose.connect(process.env.DATASOURCE_URI || 'mongodb://localhost:27017/test')
};

