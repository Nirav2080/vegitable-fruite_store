
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient> | undefined;


if (!uri || uri.includes('<') || uri.includes('>')) {
  if (process.env.NODE_ENV === 'development') {
    console.error(
      '----------------------------------------------------------------\n' +
      'WARNING: MONGODB_URI is not defined or is still a placeholder.\n' +
      'The application will run in a demo mode without a database.\n' +
      'Please add your correct MongoDB connection string to the .env file to connect to your database.\n' +
      '----------------------------------------------------------------'
    )
  }
  clientPromise = undefined;
} else {
    if (process.env.NODE_ENV === 'development') {
        // In development mode, use a global variable so that the value
        // is preserved across module reloads caused by HMR (Hot Module Replacement).
        let globalWithMongo = global as typeof globalThis & {
            _mongoClientPromise?: Promise<MongoClient>
        }

        if (!globalWithMongo._mongoClientPromise) {
            client = new MongoClient(uri, {})
            globalWithMongo._mongoClientPromise = client.connect()
        }
        clientPromise = globalWithMongo._mongoClientPromise
    } else {
        // In production mode, it's best to not use a global variable.
        client = new MongoClient(uri, {})
        clientPromise = client.connect()
    }
}


// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise
