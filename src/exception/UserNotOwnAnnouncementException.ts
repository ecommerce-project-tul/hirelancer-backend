import HttpException from './HttpException';

class UserNotOwnAnnouncement extends HttpException {
  constructor(announcementId: string, userEmail: string) {
    super(
      406,
      `User ${userEmail} not owning announcement with id ${announcementId}`,
    );
  }
}

export default UserNotOwnAnnouncement;
