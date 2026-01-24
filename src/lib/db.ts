
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!uri) {
    if (!globalWithMongo._mongoClientPromise) {
      console.warn('WARN: MONGODB_URI is not defined. Using in-memory database. All data will be lost on server restart.');
      // Fallback to a mock/in-memory setup if you have one, or just let it fail.
      // For now, we'll let the connection fail later on, but not throw a fatal error here.
      client = new MongoClient("mongodb://localhost:27017/dev-fallback");
      globalWithMongo._mongoClientPromise = client.connect();

    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, {})
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  }

} else {
  // In production mode, it's best to not use a global variable.
  if (!uri) {
    throw new Error(
      'FATAL ERROR: MONGODB_URI is not defined in the .env file for production.'
    )
  }
  client = new MongoClient(uri, {})
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise
