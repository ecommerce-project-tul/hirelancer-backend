import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exception/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exception/WrongAuthenticationTokenException';
import IDataStoredInToken from '../interface/IDataStoredInToken';
import IRequestWithUser from '../interface/IRequestWIthUser';
import userRepository from '../user/UserRepository';
import { RequestHandler } from 'express';
import { EUserRole } from '../user/EUserRole';
import UnauthroizedRoleException from '../exception/UnauthroizedUserRoleExcpetion';

 function authMiddleware(authorizedRoles?: EUserRole[]): RequestHandler {
    return async (request: IRequestWithUser, respone: Response, next: NextFunction) => {
        const authHeader = request.headers && request.headers['authorization']
        const token = authHeader?.split(" ")[1]
        
        if(!token) {
            next(new AuthenticationTokenMissingException);
        }

        const secret = process.env.JWT_SECRET

        try {
            const verification = jwt.verify(token, secret) as IDataStoredInToken;
            const user = await userRepository.findOne({where: { id: verification.userId }})

            if(!user) {
                next(new WrongAuthenticationTokenException());
            }


            if(authorizedRoles && authorizedRoles.length !== 0 && !authorizedRoles.find((role) => role === user.role)) {
                next(new UnauthroizedRoleException())
            }

            request.user = user
            next()
        } catch (error) {
            next(new WrongAuthenticationTokenException());
        }
    }
}

export default authMiddleware;