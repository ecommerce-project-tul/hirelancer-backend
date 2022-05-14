import HttpException from './HttpException';

class MessageNotFoundException extends HttpException {
  constructor(messageId: string) {
    super(404, `Messgae with id ${messageId} does not exists`);
  }
}

export default MessageNotFoundException;