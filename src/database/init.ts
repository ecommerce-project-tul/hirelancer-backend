import { DataSource } from "typeorm"

const appDataSource = new DataSource({
    type : "postgres",
    host : "localhost",
    port : 5432,
    username : "postgres",
    password : "admin",
    database : "hirelancer",
    entities : ["src/entity/*.ts"],
    logging : true,
    synchronize: true
})

export default appDataSource;