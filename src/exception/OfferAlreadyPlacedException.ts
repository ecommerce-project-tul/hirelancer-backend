import HttpException from "./HttpException";

class OfferAlreadyPlacedException extends HttpException {
  constructor(price: number) {
    super(400, `Twoja oferta z ceną ${price} dla danegeo ogłoszenia już istnieje`);
  }
}

export default OfferAlreadyPlacedException;