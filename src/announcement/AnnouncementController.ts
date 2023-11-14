import { Router, Response, Request, NextFunction } from 'express';

import { Announcement } from 'entity/Announcement';
import { Tag } from 'entity/Tag';
import { User } from 'entity/User';
import { Message } from 'entity/Message';

import UserNotFoundException from '../exception/UserNotFoundException';
import WrongUserRoleException from '../exception/WrongUserRoleException';
import validationMiddleware from '../middleware/validation-middleware';
import userRepository from '../user/UserRepository';
import tagRepository from '../tag/TagRepository';
import AddAnnouncementRequestDto from './AddAnnouncementRequestDto';
import announcementRepository from './AnnnouncementRepository';
import UpdateAnnouncementRequestDto from './UpdateAnnouncementRequestDto';
import AnnouncementNotFoundException from './AnnouncementNotFoundException';
import ChangeAnnouncementStatusRequestDto from './ChangeAnnouncementStatusRequestDto';
import { AddQuestionRequest } from './message/AddQuestionRequest';
import { AddAnswerRequest } from './message/AddAnswerRequest';
import messageRepository from './message/MessageRepository';
import { EMessageType } from '../enum/EMessageType';
import { EUserRole } from '../user/EUserRole';
import MessageNotFoundException from '../exception/MessageNotFoundException';
import UserNotOwnAnnouncement from '../exception/UserNotOwnAnnouncementException';
import HttpException from '../exception/HttpException';
import Mailer from '../mailer'
import Stripe from 'stripe'

export default class AnnouncementController {
  public path = '/announcement';

  private mailer: Mailer = null;
  public router: Router = Router();

  constructor(mailer: Mailer) {
    debugger;
    this.mailer = mailer;
    this.initializeRoutes();
  }

  private initializeRoutes() {
     
    this.router.post(
      `${this.path}`,
      validationMiddleware(AddAnnouncementRequestDto),
      this.addAnnouncement,
    );
    this.router.get(`${this.path}/:id`, this.getAnnouncementById);
    this.router.get(`${this.path}s/`, this.getAllAnnouncements);
    this.router.put(
      `${this.path}/:id`,
      validationMiddleware(UpdateAnnouncementRequestDto),
      this.updateAnnouncement,
    );
    this.router.delete(`${this.path}/:id`, this.deleteAnnouncement);
    this.router.put(
      `${this.path}/:id/status`,
      validationMiddleware(ChangeAnnouncementStatusRequestDto),
      this.updateAnnouncementStatus,
    );
    this.router.post(
      `${this.path}/:id/question/`,
      validationMiddleware(AddQuestionRequest),
      this.addQuestion,
    );
    this.router.post(
      `${this.path}/:announcementId/question/:questionId/answer`,
      validationMiddleware(AddAnswerRequest),
      this.answerTheQuestion,
    );
    this.router.post(`${this.path}/:announcementId/checkout`, this.createCheckoutSession.bind(this))
    this.router.get(`${this.path}/:announcementId/checkout/mail`, this.paymentMailNotification.bind(this))
  }

  private async getAllAnnouncements(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const tags = String(request.query.tags);
    const parsed = tags.split(',');

    try {
      const tags: Tag[] | null = await tagRepository
        .createQueryBuilder('tag')
        .where('tag.name IN (:...names)', { names: parsed })
        .getMany();


      const announcements: Announcement[] | null =
        await announcementRepository.find({
          where: {
            tags: tags as unknown as boolean,
          },
          relations: [
            "client",
            "messages",
            "tags"
          ],
        });
      response.status(200).json(announcements);
    } catch (error) {
      next(error);
    }
  }

  private async getAnnouncementById(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const anncouncementId: string = request.params.id;
    try {
      const announcement: Announcement | null =
        await announcementRepository.findOne(
          {
            where: {
              id: anncouncementId
            },
            relations: [
              "client",
              "messages",
              "messages.user",
              "messages.parent",
              "tags"
            ]
          }
        );

      if (announcement === null) {
        throw new AnnouncementNotFoundException(anncouncementId);
      }

      response.status(200).json(announcement);
    } catch (error) {
      next(error);
    }
  }

  private async updateAnnouncementStatus(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const announcementData: ChangeAnnouncementStatusRequestDto =
      request.body as ChangeAnnouncementStatusRequestDto;
    const anncouncementId: string = request.params.id;
    try {
      const announcement: Announcement | null =
        await announcementRepository.findOneBy({ id: anncouncementId });
      if (announcement === null) {
        throw new AnnouncementNotFoundException(anncouncementId);
      }

      announcement.isActive =
        announcementData.isActive || announcement.isActive;
      await announcementRepository.save(announcement);

      const res = {
        message: 'Updating announcement status',
        anncouncementId: anncouncementId,
      };

      response.status(200).json(res);
    } catch (error) {
      next(error);
    }
  }

  private async addAnnouncement(request: Request, response: Response, next: NextFunction) {
    const announcementData: AddAnnouncementRequestDto = request.body;
    try {
      const user: User | null = await userRepository.findOne({
        where: {
          email: announcementData.email
        }
      });

      if (user === null) {
        throw new UserNotFoundException(announcementData.email)
      }

      const tags: Tag[] = await Promise.all(
        announcementData.tagName.split(",").map(async (tagName: string) => {
          tagName = tagName.replace(/\s/g,'');
          if(tagName === '') 
            return;

          let tag: Tag | null = await tagRepository.findOne({
            where: {
              name: tagName
            }
          });

          if (tag === null) {
            tag = tagRepository.create({ name: tagName });
            await tagRepository.save(tag);
          }

          return tag;
        }))

      const announcement: Announcement = announcementRepository.create(
        {
          client: user,
          title: announcementData.title,
          description: announcementData.description,
          startingPrice: announcementData.startingPrice,
          deadlineDate: announcementData.deadlineDate,
          tags: tags,

        }
      )

      await announcementRepository.save(announcement);

      const res = {
        message: "Adding announcement succesful",
        userId: user.id,
        anncouncementId: announcement.id
      };

      response.status(201).json(res);

    } catch (error) {
      next(error);
    }

  }

  private async updateAnnouncement(request: Request, response: Response, next: NextFunction) {
    const announcementData: UpdateAnnouncementRequestDto = request.body as UpdateAnnouncementRequestDto;
    const anncouncementId: string = request.params.id;
    try {

      const tags: Tag[] = await Promise.all(
        announcementData.tagName.split(",").map(async (tagName: string) => {
          tagName = tagName.replace(/\s/g,'');
          if(tagName === '') 
            return;

          let tag: Tag | null = await tagRepository.findOne({
            where: {
              name: tagName
            }
          });

          if (tag === null) {
            tag = tagRepository.create({ name: tagName });
            await tagRepository.save(tag);
          }

          return tag;
        }))

      const announcement: Announcement | null = await announcementRepository.findOneBy({
        id: anncouncementId
      });

      if (announcement === null) {
        throw new AnnouncementNotFoundException(anncouncementId);
      }

      announcement.title = announcementData.title || announcement.title
      announcement.description = announcementData.description || announcement.description;
      announcement.startingPrice = announcementData.startingPrice || announcement.startingPrice;
      announcement.deadlineDate = announcementData.deadlineDate || announcement.deadlineDate;
      announcement.tags = tags.length ? tags : announcement.tags;

      await announcementRepository.save(announcement);

      const res = {
        message: "Updating announcement succesful",
        anncouncementId: anncouncementId
      };

      response.status(200).json(res);

    } catch (error) {
      next(error);
    }
  }

  private async deleteAnnouncement(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const anncouncementId: string = request.params.id;
    try {
      const announcement: Announcement | null =
        await announcementRepository.findOneBy({
          id: anncouncementId,
        });

      if (announcement === null) {
        throw new AnnouncementNotFoundException(anncouncementId);
      }

      await announcementRepository.remove(announcement);

      const res = {
        message: 'Deleting announcement succesful',
        anncouncementId: anncouncementId,
      };

      response.status(200).send(res);
    } catch (error) {
      next(error);
    }
  }

  private async addQuestion(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const addQuestionRequest: AddQuestionRequest = request.body;
    const announcementId: string = request.params.id;
    try {
      const announcement: Announcement = await announcementRepository.findOne({
        where: {
          id: announcementId,
        },
      });

      if (announcement == null) {
        throw new AnnouncementNotFoundException(announcementId);
      }

      const user: User = await userRepository.findOne({
        where: {
          email: addQuestionRequest.freelancerEmail,
        },
      });

      if (user == null) {
        throw new UserNotFoundException(addQuestionRequest.freelancerEmail);
      }

      // if (user.role !== EUserRole.FREELANCER) {
      //   throw new WrongUserRoleException(EUserRole.FREELANCER);
      // }

      const message: Message = messageRepository.create({
        announcement: announcement,
        content: addQuestionRequest.content,
        user: user,
        isAnonymous: addQuestionRequest.isAnonymous,
        messageType: EMessageType.QUESTION,
      });

      await messageRepository.save(message);

      const res = {
        message: 'Pomyślnie dodano pytanie do ogłoszenia',
        anncouncementId: announcementId,
        questionId: message.id
      };

      response.status(201).send(res);
    } catch (error) {
      next(error);
    }
  }

  private async answerTheQuestion(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const announcementId: string = request.params.announcementId;
      const questionId: string = request.params.questionId;
      const addAnswerRequest: AddAnswerRequest = request.body;

      const announcement: Announcement = await announcementRepository.findOne({
        where: {
          id: announcementId,
        },
        relations: {
          client: true,
        }
      });

      if (announcement === null) {
        throw new AnnouncementNotFoundException(announcementId);
      }

      const question: Message = await messageRepository.findOne({
        where: {
          id: questionId,
        },
        relations: {
          parent: true,
        }
      });

      if (question === null) {
        throw new MessageNotFoundException(questionId);
      }

      const user: User = await userRepository.findOne({
        where: {
          email: addAnswerRequest.clientEmail,
        },
      });

      if (user === null) {
        throw new UserNotFoundException(addAnswerRequest.clientEmail);
      }

      // if (user.role !== EUserRole.CLIENT) {
      //   throw new WrongUserRoleException(EUserRole.CLIENT);
      // }

      if (announcement.client.email !== user.email) {
        throw new UserNotOwnAnnouncement(
          announcementId,
          addAnswerRequest.clientEmail,
        );
      }


      const answer: Message = messageRepository.create({
        announcement: announcement,
        user: user,
        parent: question,
        content: addAnswerRequest.content,
        isAnonymous: false,
        messageType: EMessageType.ANSWER,
      });

      await messageRepository.save(answer);
      
      const res = {
        message: 'Pomyślnie dodano odpowiedź do ogłoszenia',
        questionId: questionId,
        answerId: answer.id,
        anncouncementId: announcementId,
      };

      response.status(201).send(res);
    } catch (error) {
      next(error);
    }
  }


  public async createCheckoutSession(request: Request, response: Response, next: NextFunction) {
    try {
        const { announcementId } = request.params
        const annoucement  = await announcementRepository.findOne(
            { 
                where: { id: announcementId }, 
                relations: ["chosenOffer", "client", "chosenOffer.freelancer"]
            }
        )

        if(!annoucement) {
            throw new AnnouncementNotFoundException(announcementId);
        }

        if(!annoucement.chosenOffer) {
            throw new HttpException(400, "Offer has not been chosen for announcement!")
        }

        const stripe = new Stripe(
            process.env.STRPIE_TOKEN, 
            {
                apiVersion: '2020-08-27',
            }
        )

        const product = await stripe.products.create({ 
            name: annoucement.title
        });


        const price = await stripe.prices.create({
            product: product.id,
            unit_amount: annoucement.chosenOffer.price * 100,
            currency: 'pln'
        });

        const session = await stripe.checkout.sessions.create({
            line_items: [
              {
                price: price.id,
                quantity: 1,
              },
            ],
            mode: 'payment',
            success_url: `http://localhost:4000/announcement/${annoucement.id}/checkout/mail?success=true`,
            cancel_url:  `http://localhost:4000/announcement/${annoucement.id}/checkout/mail?success=false`,
          });

        return response.status(200).send({url: session.url});
        // return response.redirect(303, session.url);
    } catch (error) {
        next(error)
    }
}


  public async paymentMailNotification(request: Request, response: Response, next: NextFunction) {
    try {
        const { announcementId } = request.params;
        const { success } = request.query;

       const annoucement = await announcementRepository.findOne({
         where: {
           id: announcementId
         },
         relations: ["client", "chosenOffer", "chosenOffer.freelancer"]
       })

       if(!annoucement) {
         throw new AnnouncementNotFoundException(announcementId)
       }

       if(success) {
         await this.mailer.sendMail(annoucement.client.email, "[Hirelancer] Potwierdzenie płatności", `Dokonałeś płatność za ogłoszenie ${annoucement.title}`)
         await this.mailer.sendMail(annoucement.chosenOffer.freelancer.email, "[Hirelancer] Twoja oferta została wybrana", `Twoja oferta w ogłoszeniu ${annoucement.title} została wybrana`);
       } 

      return response.redirect(303, `http://localhost:3000/payment-success`);
    } catch (error) {
      next(error)
    }
  }

}
