import { config } from 'dotenv';
import { MongoClient } from 'mongodb';
let db;

config();
const uri = process.env.DB_URI;
async function connectToDB() {
  let mongoClient;
  try {
    mongoClient = new MongoClient(uri);
    await mongoClient.connect();
    db = mongoClient.db('blog');
    console.log('Database connection successful');
    return { client: mongoClient, db };
  } catch (error) {
    console.error('Error connecting to database:', error);
    await mongoClient.close();
    throw error;
  }
}

export { connectToDB, db }
