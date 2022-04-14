import { Router, Request, Response } from "express";
import userRepository from "../repository/UserRepository";


export default class UserController {

    path = "/users";
    public router: Router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/`, this.getUsers);
    }

    private async getUsers(request: Request, response: Response) {
        const users = await userRepository.find();
        response.status(200).json(users);
    }
}