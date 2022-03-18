import { IPayment } from '@models/payment-model';
import orm from './mock-orm';

/**
 * Get one payment.
 * 
 * @param payment
 * @returns 
 */
async function getOne(payment_id: string): Promise<IPayment | null> {
    const db = await orm.openDb();
    for (const payment of db.payments) {
        if (payment.payment_id === payment_id) {
            return payment;
        }
    }
    return null;
}


/**
 * Add a payment.
 * 
 * @param payment 
 * @returns 
 */
async function add(payment: IPayment): Promise<void> {
    const db = await orm.openDb();
    db.payments.push(payment);
    return orm.saveDb(db);
}


/**
 * Update a payment.
 * 
 * @param payment 
 * @returns 
 */
async function update(payment: IPayment): Promise<void> {
    const db = await orm.openDb();
    for (let i = 0; i < db.payments.length; i++) {
        if (db.payments[i].payment_id === payment.payment_id) {
            db.payments[i] = payment;
            return orm.saveDb(db);
        }
    }
}


// Export default
export default {
    getOne,
    add,
    update,
} as const;
