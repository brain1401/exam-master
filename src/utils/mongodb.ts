import { MongoClient } from "mongodb";

const url = `mongodb+srv://brain1401:${process.env.MONGODB_PASSWORD}@exam-master.nflyglv.mongodb.net/?retryWrites=true&w=majority`;

let connectDB: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongo) {
    global._mongo = new MongoClient(url).connect();
  }
  connectDB = global._mongo;
} else {
  connectDB = new MongoClient(url).connect();
}
export { connectDB };
