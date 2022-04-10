import HttpException from './HttpException';

class IncorrectEmailOrPasswordException extends HttpException {
  constructor() {
    super(400, `Incorrect email or password`);
  }
}

export default IncorrectEmailOrPasswordException;