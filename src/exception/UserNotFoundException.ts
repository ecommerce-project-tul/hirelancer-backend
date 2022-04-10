import HttpException from './HttpException';

class UserNotFoundException extends HttpException {
  constructor(email: string) {
    super(404, `User with email ${email} does not exists`);
  }
}

export default UserNotFoundException;