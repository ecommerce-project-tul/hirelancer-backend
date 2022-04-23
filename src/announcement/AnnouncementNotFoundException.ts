import HttpException from "../exception/HttpException";

class AnnouncementNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Announcement with id ${id} does not exists`);
  }
}

export default AnnouncementNotFoundException;