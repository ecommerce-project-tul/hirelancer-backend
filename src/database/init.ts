import { DataSource } from "typeorm"
import { User } from "../entity/User";

const appDataSource = new DataSource({
    type : "postgres",
    host : "localhost",
    port : 5432,
    username : "postgres",
    password : "admin",
    database : "hirelancer",
    entities : [User],
    logging : true,
    synchronize: true
})

export default appDataSource;