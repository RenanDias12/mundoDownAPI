import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";


class TestDatabase {

    constructor() {
        this.mongod = null;
    }

    //connect to the inmemory database
    async connect() {
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        const mongooseOpts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        await mongoose.connect(uri, mongooseOpts);
        this.mongod = mongod;
    }

    //clear the database
    async clear() {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    }

    //disconnect from the inmemory database
    async disconnect() {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await this.mongod.stop();
    }
}

export { TestDatabase };