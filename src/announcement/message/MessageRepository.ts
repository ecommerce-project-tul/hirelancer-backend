import appDataSource from '../../database/init';
import { Message } from '../../entity/Message';

const messageRepository = appDataSource.getRepository(Message);
export default messageRepository;
