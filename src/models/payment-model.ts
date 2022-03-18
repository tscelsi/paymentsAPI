import { stringify } from "querystring";
import { getRandomInt } from '@shared/functions';
import { v4 as uuidv4 } from 'uuid';

type State = "pending" | "incomplete" | "successful"

// Payment schema
export interface IPayment {
    payment_id: string;
    user_id: string;
    amount: number;
    description: string;
    created_at: string;
    amended_at?: string;
    receiving_user_id: string;
    state: State
}


/**
 * Get a new User object.
 * 
 * @returns 
 */
export function getNew(user_id: string, amount: number, description: string, receiving_user_id: string): IPayment {
    const payment_id = uuidv4();
    return {
        payment_id: payment_id,
        user_id: user_id,
        amount,
        description,
        receiving_user_id,
        created_at: new Date().toISOString(),
        state: "pending"
    };
}


// Export default
export default {
    getNew,
}
