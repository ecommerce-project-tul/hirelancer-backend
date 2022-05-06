import HttpException from "../exception/HttpException";

class ReviewNotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Review with id ${id} does not exists`);
  }
}

export default ReviewNotFoundException;