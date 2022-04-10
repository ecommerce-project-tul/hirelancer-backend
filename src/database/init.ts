import { DataSource } from "typeorm"
import { Announcement } from "../entity/Announcement";
import { Message } from "../entity/Message";
import { Offer } from "../entity/Offer";
import { Payment } from "../entity/Payment";
import { Review } from "../entity/Review";
import { Tag } from "../entity/Tag";
import { TechnologyStack } from "../entity/TechnologyStack";
import { User } from "../entity/User";
import { UserTechnologyStack } from "../entity/UserTechnologyStack";
import dotenv from 'dotenv'
dotenv.config()


const appDataSource = new DataSource({
    type : "postgres",
    host : process.env.DATABASE_HOST,
    port : Number(process.env.DATABASE_PORT),
    username : process.env.DATABASE_USERNAME,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE_NAME,
    entities : [User, Announcement, Review, Payment, Tag, TechnologyStack, Offer, UserTechnologyStack, Message],
    logging : true,
    synchronize: true,
    dropSchema: true,
})

export default appDataSource;