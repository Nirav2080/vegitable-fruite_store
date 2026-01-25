
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

let client: MongoClient;
let clientPromise: Promise<MongoClient | null>;

if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('<')) {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      '----------------------------------------------------------------\n' +
      'WARNING: MONGODB_URI is not defined or is a placeholder.\n' +
      'The application will run in a demo mode without a database.\n' +
      'Please add your correct MongoDB connection string to the .env file.\n' +
      '----------------------------------------------------------------'
    );
  }
  clientPromise = Promise.resolve(null);
} else {
  const options = {};
  if (process.env.NODE_ENV === 'development') {
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient | null>
    }
    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(process.env.MONGODB_URI, options);
      globalWithMongo._mongoClientPromise = client.connect().catch(err => {
        console.error(
            '----------------------------------------------------------------\n' +
            `ERROR: Failed to connect to MongoDB: ${err.message}\n` +
            'This usually means your MONGODB_URI in the .env file is incorrect.\n' +
            'Please double-check your username, password, and database name.\n' +
            'The application will run in a demo mode.\n' +
            '----------------------------------------------------------------'
        );
        return null;
      });
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(process.env.MONGODB_URI, options);
    clientPromise = client.connect().catch(err => {
        console.error(`Failed to connect to MongoDB: ${err.message}`);
        return null;
    });
  }
}

export default clientPromise;
