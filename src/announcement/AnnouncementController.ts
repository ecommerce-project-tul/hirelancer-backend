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

export default class AnnouncementController {
  public path = '/announcement';

  public router: Router = Router();

  constructor() {
    debugger;
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
            "messages",
            "messages.user",
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
            relations: {
              messages: true
            }
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

  private async addAnnouncement(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const announcementData: AddAnnouncementRequestDto = request.body;
    try {
      const user: User | null = await userRepository.findOne({
        where: {
          email: announcementData.email,
        },
      });

      if (user === null) {
        throw new UserNotFoundException(announcementData.email);
      }

      let tag: Tag | null = await tagRepository.findOne({
        where: {
          name: announcementData.tagName,
        },
      });

      if (tag === null) {
        tag = tagRepository.create({ name: announcementData.tagName });
        await tagRepository.save(tag);
      }

      const announcement: Announcement = announcementRepository.create({
        client: user,
        title: announcementData.title,
        description: announcementData.description,
        startingPrice: announcementData.startingPrice,
        deadlineDate: announcementData.deadlineDate,
        tags: [tag],
      });

      await announcementRepository.save(announcement);

      const res = {
        message: 'Adding announcement succesful',
        userId: user.id,
        anncouncementId: announcement.id,
      };

      response.status(201).json(res);
    } catch (error) {
      next(error);
    }
  }

  private async updateAnnouncement(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const announcementData: UpdateAnnouncementRequestDto =
      request.body as UpdateAnnouncementRequestDto;
    const anncouncementId: string = request.params.id;
    try {
      let tag: Tag | null = await tagRepository.findOne({
        where: {
          name: announcementData.tagName,
        },
      });

      if (tag === null) {
        tag = tagRepository.create({ name: announcementData.tagName });
        await tagRepository.save(tag);
      }

      const announcement: Announcement | null =
        await announcementRepository.findOneBy({
          id: anncouncementId,
        });

      if (announcement === null) {
        throw new AnnouncementNotFoundException(anncouncementId);
      }

      announcement.title = announcementData.title || announcement.title;
      announcement.description =
        announcementData.description || announcement.description;
      announcement.startingPrice =
        announcementData.startingPrice || announcement.startingPrice;
      announcement.deadlineDate =
        announcementData.deadlineDate || announcement.deadlineDate;
      announcement.tags = [tag] || announcement.tags;

      await announcementRepository.save(announcement);

      const res = {
        message: 'Updating announcement succesful',
        anncouncementId: anncouncementId,
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

      if (user.role !== EUserRole.FREELANCER) {
        throw new WrongUserRoleException(EUserRole.FREELANCER);
      }

      const message: Message = messageRepository.create({
        announcement: announcement,
        content: addQuestionRequest.content,
        user: user,
        isAnonymous: addQuestionRequest.isAnonymous,
        messageType: EMessageType.QUESTION,
      });

      await messageRepository.save(message);

      const res = {
        message: 'Creating question for announcement succesful',
        anncouncementId: announcementId,
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

      if (user.role !== EUserRole.CLIENT) {
        throw new WrongUserRoleException(EUserRole.CLIENT);
      }

      if (announcement.client.email !== user.email) {
        throw new UserNotOwnAnnouncement(
          announcementId,
          addAnswerRequest.clientEmail,
        );
      }

      const answer: Message = messageRepository.create({
        announcement: announcement,
        message: question,
        content: addAnswerRequest.content,
        isAnonymous: false,
        messageType: EMessageType.ANSWER,
      });

      await messageRepository.save(answer);

      const res = {
        message: 'Creating answer for question',
        questionId: questionId,
        anncouncementId: announcementId,
      };

      response.status(201).send(res);
    } catch (error) {
      next(error);
    }
  }
}
