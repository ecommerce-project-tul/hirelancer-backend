import bcrypt from "bcrypt";
import { Router, Request, Response, NextFunction } from "express";
import validationMiddleware from "../middleware/validation-middleware";
import RegistrationRequestDto from "./RegistrationRequestDto";
import userRepository from "../repository/UserRepository";
import UserWithThatEmailAlreadyExistsException from "../exception/UserWithThatEmailAlreadyExistsException";
import { User } from "../entity/User";
import LoginRequestDto from "./LoginRequestDto";
import UserNotFoundException from "../exception/UserNotFoundException";
import IncorrectEmailOrPasswordException from "../exception/IncorrectEmailOrPasswordException";
import * as jwt from 'jsonwebtoken'
import RegistrationResponseDto from "./RegistrationResponseDto";
import LoginResponseDto from "./LoginResponseDto";

export default class AuthController {

    path = "/auth";
    public router: Router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, validationMiddleware(RegistrationRequestDto), this.registerUser);
        this.router.post(`${this.path}/login`, validationMiddleware(LoginRequestDto), this.loginUser);
    }

    public async registerUser(request: Request, response: Response, next: NextFunction) {
        const userData: RegistrationRequestDto = request.body;
        try {
            if (
                await userRepository.findOne({where: {email: userData.email}})
              ) {
                throw new UserWithThatEmailAlreadyExistsException(userData.email);
              }
              const hashedPassword = await bcrypt.hash(userData.password, 10);
              const user: User = userRepository.create({
                ...userData,
                password: hashedPassword,
              });

              await userRepository.save(user);

              const res: RegistrationResponseDto = {
                message: "Registration succesful",
                userId: user.id,
              }

              response.status(201).json(res);
        } catch (error) {
            next(error);
        }
    } 
    
    public async loginUser(request: Request, response: Response, next: NextFunction) {
        const userData: LoginRequestDto = request.body;
        try {
            const user: User = await userRepository.findOne({where:{email: userData.email}});
            
            if (user === null) {
                throw new UserNotFoundException(userData.email);    
            }

            if (!bcrypt.compareSync(userData.password, user.password)) {
                throw new IncorrectEmailOrPasswordException();
            }

            const expiresIn = 60 * 60; // an hour
            const secret = process.env.JWT_SECRET;

            const res: LoginResponseDto = {
                expiresIn,
                token: jwt.sign({ ...user }, secret, { expiresIn }),
            }

            response.status(201).json(res);
        } catch (error) {
            next(error);
        }
    }


    
}