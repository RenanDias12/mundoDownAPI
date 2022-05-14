import mongoose, { connect } from "mongoose";
import 'dotenv/config';
import {MongoClient} from "mongodb";
//import { MongoMemoryServer } from "mongodb-memory-server";


class TestDatabase {
  constructor() { }

  //connect to the database
  async connect() {
    const uri = process.env.TEST_MONGODB_URI;
    const mongooseOpts = {
      authSource: process.env.MONGO_AUTH_SOURCE,
      user: process.env.ADMIN_MONGO_USER,
      pass: process.env.ADMIN_MONGO_PASSWORD,
      useNewUrlParser: true,
    };
    try {
        await mongoose.connect(uri, mongooseOpts);
    } catch (error) {
        console.log("Error", error);
    }
  }

  //clear the database
  async clear() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }

  //disconnect from the database
  async disconnect() {
    try {
        await mongoose.connection.close(true);
    } catch (error) {
        console.log("Error", error);
    }
  }
}

export { TestDatabase };