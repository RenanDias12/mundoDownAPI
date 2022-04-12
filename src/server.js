import express from 'express';
import 'dotenv/config';
import {routes} from './routes';
import mongoose from 'mongoose';

const app = express();
const uri = JSON.parse(process.env.DEVELOP_RUNNING) ? process.env.DEV_MONGODB_URI : process.env.MONGODB_URI;
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
