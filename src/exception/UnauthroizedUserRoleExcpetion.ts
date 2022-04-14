import HttpException from './HttpException';

class UnauhtorizedUserRoleException extends HttpException {
  constructor() {
    super(401, "Unsufficient user's permissions");
  }
}

export default UnauhtorizedUserRoleException