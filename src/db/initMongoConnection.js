import dotenv from 'dotenv';
import 'dotenv/config';
import mongoose from 'mongoose';

dotenv.config();

export const initMongoDB = async () => {
  try {
    const user = process.env.MONGODB_USER;
    const pwd = process.env.MONGODB_PASSWORD; 
    const url = process.env.MONGODB_URL;
    const db = process.env.MONGODB_DB;

    if (!user || !pwd || !url || !db) {
      throw new Error('One or more MongoDB environment variables are missing');
    }

    await mongoose.connect(
      `mongodb+srv://${user}:${encodeURIComponent(pwd)}@${url}/${db}?retryWrites=true&w=majority`
    );
    console.log('Mongo connection successfully established!');
  } catch (error) {
    throw new Error(error.message);
  }
};
