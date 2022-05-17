import express from 'express';
import 'dotenv/config';
import {routes} from '../src/routes';
import mongoose from 'mongoose';

const app = express();
const uri = process.env.TEST_MONGODB_URI;

mongoose.connect(uri, {
    authSource: process.env.MONGO_AUTH_SOURCE,
    user: process.env.ADMIN_MONGO_USER,
    pass: process.env.ADMIN_MONGO_PASSWORD,
    useNewUrlParser: true
});

app.use(express.json());
app.use(routes);

export default app;
