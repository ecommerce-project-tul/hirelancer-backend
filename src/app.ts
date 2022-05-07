import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import UserController from './user/UserController';
import appDataSource from './database/init';
import AuthController from './auth/AuthController';
import errorMiddleware from './middleware/error-middleware';
import loggerMiddleware from './middleware/logger-middleware';
import AnnouncementController from './announcement/AnnouncementController';
import cors from 'cors';

dotenv.config();
const app = express()

app.set("views", path.join(__dirname, 'views'))
app.set("view engine", 'ejs')

app.use(cors());
app.use(logger("dev"))
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use("/", new AuthController().router);
app.use("/", new UserController().router);
app.use("/", new AnnouncementController().router);
app.use(errorMiddleware)

const PORT = process.env.PORT || 4000;
appDataSource.initialize()
.then(() => {
    app.listen(PORT, ()=> console.log(`Server is listening on PORT - ${PORT}`))
})
.catch((error) => {
    console.log(error)
})
