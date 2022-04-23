import appDataSource from "../database/init"
import { Announcement } from "../entity/Announcement"

const announcementRepository = appDataSource.getRepository(Announcement);
export default announcementRepository;