import { DataSource } from "typeorm"
import { Announcement } from "../entity/Announcement";
import { AnnouncementTag } from "../entity/AnnouncementTag";
import { Message } from "../entity/Message";
import { Offer } from "../entity/Offer";
import { Payment } from "../entity/Payment";
import { Review } from "../entity/Review";
import { Tag } from "../entity/Tag";
import { TechnologyStack } from "../entity/TechnologyStack";
import { User } from "../entity/User";
import { UserTechnologyStack } from "../entity/UserTechnologyStack";

const appDataSource = new DataSource({
    type : "postgres",
    host : "localhost",
    port : 5432,
    username : "postgres",
    password : "skorpion1",
    database : "hirelancer",
    entities : [User, Announcement, Review, Payment, Tag, TechnologyStack, Offer, UserTechnologyStack, Message],
    logging : true,
    synchronize: true,
    dropSchema: true,
})

export default appDataSource;