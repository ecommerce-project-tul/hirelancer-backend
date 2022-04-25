import appDataSource from "../database/init"
import { Tag } from "../entity/Tag"

const tagRepository = appDataSource.getRepository(Tag);
export default tagRepository;