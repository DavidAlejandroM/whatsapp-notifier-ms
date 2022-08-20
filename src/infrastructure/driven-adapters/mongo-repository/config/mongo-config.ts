import mongoose from 'mongoose';

export const mongoConnection = () => {
    mongoose.set('debug', true);
    mongoose.connect('mongodb://localhost:27017/test')
};

