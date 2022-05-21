import { Offer } from "../../entity/Offer";
import appDataSource from "./../../database/init";

const offerRepository = appDataSource.getRepository(Offer);
export default offerRepository;