import { MongoClient, type Db } from 'mongodb'

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error('Please add your MONGODB_URI to the .env file')
}

const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient | null>

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient | null> | undefined
}

function connectClient(): Promise<MongoClient | null> {
  return client.connect().then((c) => {
    console.log(`✅ MongoDB connected successfully (${process.env.NODE_ENV})`)
    return c
  }).catch((err: Error) => {
    console.error('❌ MongoDB connection failed:', err.message)
    if (err.message.includes('bad auth')) {
      console.error(
        'Authentication failed. Verify MONGODB_URI on your server:\n' +
        '- username and password are correct\n' +
        '- special characters in password are URL-encoded (@ → %40)\n' +
        '- the database user exists on this Atlas cluster'
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
    return connectedClient.db(process.env.DB_NAME || 'aotearoa-organics')
  } catch {
    return null
  }
}

export default clientPromise
