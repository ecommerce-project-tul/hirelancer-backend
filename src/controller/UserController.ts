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
        console.log(userRepository)

        const test = await userRepository.find();
        response.json(test);
    }
}