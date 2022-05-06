import appDataSource from "../database/init"
import { User } from "../entity/User"

const userRepository = appDataSource.getRepository(User);
export default userRepository;