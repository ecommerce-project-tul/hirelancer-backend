import { Router, Request, Response, RequestHandler, NextFunction } from "express";
import userRepository from "./UserRepository";
import reviewRepository from "../review/ReviewRepository";
import UpdateUserDto from "./UpdateUserDto";
import IRequestWithUser from '../interface/IRequestWIthUser';
import { EUserRole } from "./EUserRole";
import UserNotFoundException from "../exception/UserNotFoundException";
import AddReviewRequestDto from "../review/AddReviewRequestDto";
import { Review } from "../entity/Review";
import { User } from '../entity/User'
import WrongUserRoleException from "../exception/WrongUserRoleException";
import validationMiddleware from "../middleware/validation-middleware";
import UpdateReviewRequestDto from "../review/UpdateReviewRequestDto";
import ReviewNotFoundException from "../review/ReviewNotFoundException";

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
        this.router.put(`${this.path}/:email`, validationMiddleware(UpdateUserDto),this.updateUserByEmail)
        this.router.get(`${this.path}/:email/reviews`, this.getReviewsForFreelancerUserByEmail)
        this.router.get(`${this.path}/:email/reviews/:reviewId`, this.getReviewForFreelancerUserByEmailAndReviewId)
        this.router.post(`${this.path}/:email/reviews`, validationMiddleware(AddReviewRequestDto), this.addReviewForFreelancerUserByEmail)
        this.router.put(`${this.path}/:email/reviews/:reviewId`, validationMiddleware(UpdateReviewRequestDto), this.updateReviewForFreelancerUserByEmailAndReviewId)
        this.router.delete(`${this.path}/:email/reviews/:reviewId`, this.deleteReviewForFreelancerUserByEmailAndReviewId)
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

    private async getReviewsForFreelancerUserByEmail(request: IRequestWithUser, response: Response, next: NextFunction) {
        try {
            const { email } = request.params;

            const freelancer: User | null = await userRepository.findOneBy({
                email: email
            })
            
            if(!freelancer) {
                throw new UserNotFoundException(email)
            }

            if(freelancer.role !== EUserRole.FREELANCER) {
                throw new WrongUserRoleException(EUserRole.FREELANCER)
            }

           const reviews = await reviewRepository.findBy({freelancer: freelancer as unknown as boolean})
           response.status(200).json(reviews);
        } catch (error) {
            next(error);
        }
    }

    public async getReviewForFreelancerUserByEmailAndReviewId(request: Request, response: Response, next: NextFunction) {
        try{
            const { email, reviewId } = request.params;

            const freelancer: User | null = await userRepository.findOneBy({
                email: email
            })

            if(!freelancer) {
                throw new UserNotFoundException(email)
            }

            if(freelancer.role !== EUserRole.FREELANCER) {
                throw new WrongUserRoleException(EUserRole.FREELANCER)
            }

            const review: Review | null = await reviewRepository.findOneBy({
                id: reviewId
            })

            if(!review) {
                throw new ReviewNotFoundException(reviewId)
            }

            response.status(200).json(review);
        } catch(error) {
            next(error)
        }
    }

    private async addReviewForFreelancerUserByEmail(request: Request, response: Response, next: NextFunction) {
        try{
            const { email } = request.params;
            const addReviewRequestData : AddReviewRequestDto = request.body as AddReviewRequestDto;

            const freelancer: User | null = await userRepository.findOneBy({
                email: email
            })

            if(!freelancer) {
                throw new UserNotFoundException(email)
            }

            if(freelancer.role !== EUserRole.FREELANCER) {
                throw new WrongUserRoleException(EUserRole.FREELANCER)
            }

            const client: User | null = await userRepository.findOneBy({
                id: addReviewRequestData.clientId
            })

            if(!client) {
                throw new UserNotFoundException(email)
            }

            if(client.role !== EUserRole.CLIENT) {
                throw new WrongUserRoleException(EUserRole.CLIENT)
            }

            const review: Review = reviewRepository.create({
                client: client,
                freelancer: freelancer,
                score: addReviewRequestData.score,
                description: addReviewRequestData.description
            })

            await reviewRepository.save(review);

            const res = {
                message: "Adding review succesful",
                reviewId: review.id,
                freelancerId: freelancer.id,
                clientId: client.id
            };

            response.status(201).json(res);
        } catch(error) {
            next(error)
        }
    }


    public async updateReviewForFreelancerUserByEmailAndReviewId(request: Request, response: Response, next: NextFunction) {
        try{
            const { email, reviewId } = request.params;
            const updateReviewRequestData : UpdateReviewRequestDto= request.body as UpdateReviewRequestDto;

            const freelancer: User | null = await userRepository.findOneBy({
                email: email
            })

            if(!freelancer) {
                throw new UserNotFoundException(email)
            }

            if(freelancer.role !== EUserRole.FREELANCER) {
                throw new WrongUserRoleException(EUserRole.FREELANCER)
            }

            const review: Review | null = await reviewRepository.findOneBy({
                id: reviewId
            })

            if(!review) {
                throw new ReviewNotFoundException(reviewId)
            }

            review.score =  updateReviewRequestData.score || review.score
            review.description = updateReviewRequestData.description || review.description
            await reviewRepository.save(review);

            const res = {
                message: "Updating review succesful",
                reviewId: review.id
            };

            response.status(200).json(res);
        } catch(error) {
            next(error)
        }
    }

    private async deleteReviewForFreelancerUserByEmailAndReviewId(request: Request, response: Response, next: NextFunction) {
        try{
            const { email, reviewId } = request.params;

            const freelancer: User | null = await userRepository.findOneBy({
                email: email
            })

            if(!freelancer) {
                throw new UserNotFoundException(email)
            }

            if(freelancer.role !== EUserRole.FREELANCER) {
                throw new WrongUserRoleException(EUserRole.FREELANCER)
            }

            const review: Review | null = await reviewRepository.findOneBy({
                id: reviewId
            })

            if(!review) {
                throw new ReviewNotFoundException(reviewId)
            }
    
            await reviewRepository.remove(review)

            const res = {
                message: "deleting review succesful",
                reviewId: reviewId
            };

            response.status(201).json(res);
        } catch(error) {
            next(error)
        }
    }

}