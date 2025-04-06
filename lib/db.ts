import { MongoClient, MongoClientOptions } from 'mongodb';

const uri: string = process.env.DB_HOST || "";
const options: MongoClientOptions = {};

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

// Definisi variabel global untuk menyimpan koneksi MongoDB
interface GlobalMongo {
  _mongoClientPromise?: Promise<MongoClient>;
}

declare const global: GlobalMongo;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // Gunakan variabel global untuk menyimpan koneksi dalam mode pengembangan
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Buat koneksi baru di mode produksi
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
