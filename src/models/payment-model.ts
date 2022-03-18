import { stringify } from "querystring";
import { getRandomInt } from '@shared/functions';

type State = "pending" | "incomplete" | "successful"

// Payment schema
export interface IPayment {
    payment_id: number;
    user_id: number;
    description: string;
    created_at: string;
    receiving_user_id: number;
    state: State
}


/**
 * Get a new User object.
 * 
 * @returns 
 */
function getNew(user_id: number, description: string, receiving_user_id: number): IPayment {
    return {
        payment_id: getRandomInt(),
        user_id: user_id,
        description,
        receiving_user_id,
        created_at: new Date().toISOString(),
        state: "pending"
    };
}


// Export default
export default {
    new: getNew,
}
