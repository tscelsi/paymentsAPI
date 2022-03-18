import { UnauthorisedError } from "@shared/errors";
import { NextFunction, Request, Response } from "express";
import userRepo from "@repos/user-repo";


/**
 * A simple function that spoofs some form of user authorisation. This may usually be done with JWT tokens or something of the like.
 * In this case, we simply check if an access_token (user id) exists and that a user with that ID exists in the database.
 * @param req 
 * @param res 
 * @param next 
 */
export const validateUser = (req: Request, res: Response, next: NextFunction) => {
    const { access_token } = req.headers;
    if (!access_token) throw new UnauthorisedError();
    // check if user exists in database
    const user = userRepo.getOne(access_token as string);
    if (!user) throw new UnauthorisedError();
    next();
};