import { Announcement } from "entity/Announcement";
import { Tag } from "entity/Tag";
import { User } from "entity/User";
import UserNotFoundException from "../exception/UserNotFoundException";
import { Router, Response, Request, NextFunction } from "express";
import validationMiddleware from "middleware/validation-middleware";
import userRepository from "../repository/UserRepository";
import tagRepository from "../tag/TagRepository";
import AddAnnouncementRequestDto from "./AddAnnouncementRequestDto";
import announcementRepository from "./AnnnouncementRepository";

export default class AnnouncementController {

    public path = "/announcement";
    public router: Router = Router();

    constructor() {
        debugger;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}`, this.addAnnouncement);
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
            console.log(error)
            
            next(error);
        }

    }
}