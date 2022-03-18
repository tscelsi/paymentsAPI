/**
 * Ensure that payment information is valid and if it is, create the payment object.
 */

import { IPayment } from "@models/payment-model";
import { InvalidAmountError } from "@shared/errors";
import paymentRepo from "@repos/payment-repo";


export const validateAndPersistPayment = async (payment: IPayment): Promise<void> => {
    // ensure no negative amount, we allow 0 amounts.
    if (payment.amount < 0) {
        throw new InvalidAmountError();
    } else {
        await paymentRepo.add(payment);
    }
}