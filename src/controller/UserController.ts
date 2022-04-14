import { Router, Request, Response, RequestHandler, NextFunction } from "express";
import userRepository from "../repository/UserRepository";
import authMiddleware from '../middleware/auth-middleware'
import { EUserRole } from "../enum/EUserRole";
import UserNotFoundException from "../exception/UserNotFoundException";
import UpdateUserDto from "../dto/UpdateUserDto";

export default class UserController {

    path = "/users";
    public router: Router = Router();

    constructor() {
        this.initializeRoutes();
    }

    // TODO add auth middleware
    private initializeRoutes() {
        this.router.get(`${this.path}/`, this.getUsers)
        this.router.get(`${this.path}/:email`, this.getUserByEmail)
        this.router.delete(`${this.path}/:email`, this.deleteUserByEmail)
        this.router.put(`${this.path}/:email`, this.updateUserByEmail)
    }
    private async updateUserByEmail(request: Request, response: Response, next: NextFunction) {
        try {
            const { email } = request.params;
            const updateData : UpdateUserDto = request.body as UpdateUserDto;
            const user = await userRepository.findOneBy({email: email});
            user.firstName = updateData.firstName || user.firstName;
            user.lastName = updateData.lastName || user.lastName;
            user.photo = updateData.photo || user.photo;
            user.description = updateData.description || user.description;
            user.githubLink = updateData.githubLink || user.githubLink;
            user.linkedInLink = updateData.linkedInLink || user.linkedInLink;
            await userRepository.save(user);
            response.status(200).json({id: user.id});
        } catch (error) {
            next(error);
        }
    }
    
    private async getUsers(request: Request, response: Response) {
        const users = await userRepository.find();
        response.status(200).json(users);
    }

    private async getUserByEmail(request: Request, response: Response, next: NextFunction) {
        try {
            const { email } = request.params;
            const user = await userRepository.findOneBy({email})
            response.status(200).json(user)
        } catch (error) {
            next(error);
        }
    }
 
    private async deleteUserByEmail(request: Request, response: Response, next: NextFunction) {
        try {
            const { email } = request.params;
            await userRepository.delete({email})
            response.status(200).json({email: email})
        } catch (error) {
            next(error);
        }
    }
}