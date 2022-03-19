import { v4 } from "uuid";

// User schema
export interface IUser {
    id: string;
    name: string;
    email: string;
    balance: number;
}


/**
 * Get a new User object.
 * 
 * @returns 
 */
function getNew(name: string, email: string, balance = 0): IUser {
    return {
        id: v4(),
        email,
        name,
        balance
    };
}


/**
 * Copy a user object.
 * 
 * @param user 
 * @returns 
 */
function copy(user: IUser): IUser {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        balance: user.balance
    }
}


// Export default
export default {
    new: getNew,
    copy,
}
