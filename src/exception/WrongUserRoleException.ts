import { EUserRole } from 'user/EUserRole';
import HttpException from './HttpException';

class WrongUserRoleException extends HttpException {
  constructor(role: EUserRole ) {
    super(401, "User is not a " + role);
  }
}

export default WrongUserRoleException