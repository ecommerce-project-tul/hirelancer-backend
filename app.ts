import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import appDataSource from './src/database/init';
import dotenv from 'dotenv'

dotenv.config()
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const APP_PORT = process.env.APP_PORT || 3000;

appDataSource.initialize()
.then(() => app.listen( APP_PORT, () => console.log(`Server is listening on port ${APP_PORT}`)))
.catch((error) => console.log(error));
