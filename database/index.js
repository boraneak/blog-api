import { config } from 'dotenv';
config();
import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = process.env.DB_URI;
export async function dbConn() {
  let mongoClient;
  try {
    mongoClient = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
      }
    });
    await mongoClient.connect();
    console.log('Database connection successful');
    return mongoClient;
  } catch (error) {
    console.error('Error connecting to database:', error);
    await mongoClient.close();
  }
}
