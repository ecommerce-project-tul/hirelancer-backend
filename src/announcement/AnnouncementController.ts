import { Announcement } from "entity/Announcement";
import { Tag } from "entity/Tag";
import { User } from "entity/User";
import UserNotFoundException from "../exception/UserNotFoundException";
import { Router, Response, Request, NextFunction } from "express";
import validationMiddleware from "../middleware/validation-middleware";
import userRepository from "../repository/UserRepository";
import tagRepository from "../tag/TagRepository";
import AddAnnouncementRequestDto from "./AddAnnouncementRequestDto";
import announcementRepository from "./AnnnouncementRepository";
import UpdateAnnouncementRequestDto from "./UpdateAnnouncementRequestDto";
import AnnouncementNotFoundException from "./AnnouncementNotFoundException";
import ChangeAnnouncementStatusRequestDto from "./ChangeAnnouncementStatusRequestDto";

export default class AnnouncementController {

    public path = "/announcement";
    public router: Router = Router();

    constructor() {
        debugger;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}`, validationMiddleware(AddAnnouncementRequestDto), this.addAnnouncement);
        this.router.put(`${this.path}/:id`, validationMiddleware(UpdateAnnouncementRequestDto), this.updateAnnouncement);
        this.router.put(`${this.path}/:id/status`, validationMiddleware(ChangeAnnouncementStatusRequestDto), this.updateAnnouncementStatus);
    }

    private async updateAnnouncementStatus(request: Request, response: Response, next: NextFunction) {
        const announcementData: ChangeAnnouncementStatusRequestDto = request.body as ChangeAnnouncementStatusRequestDto;
        const anncouncementId : string = request.params.id;
        try {

            const announcement: Announcement | null = await announcementRepository.findOneBy({id: anncouncementId});
            if (announcement === null) {
                throw new AnnouncementNotFoundException(anncouncementId);
            }
            
            announcement.isActive = announcementData.isActive || announcement.isActive;
            await announcementRepository.save(announcement);
            
            const res = {
                message: "Updating announcement status",
                anncouncementId: anncouncementId
            };

            response.status(200).json(res);
            
        } catch(error) {
            next(error);
        }
    }

    private async addAnnouncement(request: Request, response: Response, next: NextFunction) {
        const announcementData: AddAnnouncementRequestDto = request.body;
        try {
            const user: User | null = await userRepository.findOne({where: {email : announcementData.email}});
            if (user === null) {
                throw new UserNotFoundException(announcementData.email)
            }

            let tag: Tag | null = await tagRepository.findOne({where: {name: announcementData.tagName}});
            if (tag === null) {
                tag = tagRepository.create({name : announcementData.tagName});
                await tagRepository.save(tag);
            }
            
            const announcement: Announcement = announcementRepository.create(
                {
                    client: user,
                    description: announcementData.description,
                    startingPrice: announcementData.startingPrice,
                    deadlineDate: announcementData.deadlineDate,
                    tags: [tag]
                }
            )

            await announcementRepository.save(announcement);
            
            const res = {
                message: "Adding announcement succesful",
                userId: user.id,
                anncouncementId: announcement.id
            };

            response.status(201).json(res);
            
        } catch(error) {            
            next(error);
        }

    }

    private async updateAnnouncement(request: Request, response: Response, next: NextFunction) {
        const announcementData: UpdateAnnouncementRequestDto = request.body as UpdateAnnouncementRequestDto;
        const anncouncementId : string = request.params.id;
        try {

            let tag: Tag | null = await tagRepository.findOne({where: {name: announcementData.tagName}});
            if (tag === null) {
                tag = tagRepository.create({name : announcementData.tagName});
                await tagRepository.save(tag);
            }
            
            const announcement: Announcement | null = await announcementRepository.findOneBy({id: anncouncementId});
            if (announcement === null) {
                throw new AnnouncementNotFoundException(anncouncementId);
            }

            announcement.description = announcementData.description || announcement.description;
            announcement.startingPrice = announcementData.startingPrice || announcement.startingPrice;
            announcement.deadlineDate = announcementData.deadlineDate || announcement.deadlineDate;
            announcement.tags = [tag] || announcement.tags;
            await announcementRepository.save(announcement);
            
            const res = {
                message: "Updating announcement succesful",
                anncouncementId: anncouncementId
            };

            response.status(200).json(res);
            
        } catch(error) {
            next(error);
        }

    }
}