import express from 'express';
import 'dotenv/config';
import {routes} from './routes';
import mongoose from 'mongoose';

const app = express();
const uri = 'mongodb://localhost:27017/users';
const port = process.env.PORT;

mongoose.connect(uri, {
    authSource: process.env.MONGO_AUTH_SOURCE,
    user: process.env.ADMIN_MONGO_USER,
    pass: process.env.ADMIN_MONGO_PASSWORD,
    useNewUrlParser: true
});

app.use(express.json());
app.use(routes);

app.listen(port, () => console.log('Server is runnig on port', port));
