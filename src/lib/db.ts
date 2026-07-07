import { MongoClient, type Db } from 'mongodb'
import { getDbName, getMongoConfigSource, getMongoUri } from '@/lib/mongo-config'

const uri = getMongoUri()

const options = {
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
}

let client: MongoClient
let clientPromise: Promise<MongoClient | null>

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient | null> | undefined
}

function connectClient(): Promise<MongoClient | null> {
  return client.connect().then((c) => {
    console.log(
      `✅ MongoDB connected successfully (${process.env.NODE_ENV}, source: ${getMongoConfigSource()})`
    )
    return c
  }).catch((err: Error) => {
    console.error('❌ MongoDB connection failed:', err.message)
    if (err.message.includes('bad auth')) {
      console.error(
        'Authentication failed. On production, prefer separate env vars:\n' +
        'MONGODB_USER, MONGODB_PASSWORD (plain text), MONGODB_HOST, DB_NAME'
      )
    }
    return null
  })
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = connectClient()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = connectClient()
}

export async function getDatabase(): Promise<Db | null> {
  try {
    const connectedClient = await clientPromise
    if (!connectedClient) return null
    return connectedClient.db(getDbName())
  } catch {
    return null
  }
}

export default clientPromise
