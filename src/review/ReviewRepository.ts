import appDataSource from "../database/init"
import { Review } from "../entity/Review"

const reviewRepository = appDataSource.getRepository(Review);
export default reviewRepository;