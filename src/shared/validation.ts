/**
 * Ensure that payment information is valid and if it is, create the payment object.
 */

import { IPayment } from "@models/payment-model";
import { InvalidAmountError, BeneficiaryNotFoundError } from "@shared/errors";
import paymentRepo from "@repos/payment-repo";
import userRepo from "@repos/user-repo";

export const validateAndPersistPayment = async (payment: IPayment): Promise<void> => {
    // ensure no negative amount, we allow 0 amounts.
    const receiving_user = await userRepo.persists(payment.receiving_user_id);
    if (payment.amount < 0) {
        throw new InvalidAmountError();
    } else if (!receiving_user) {
        throw new BeneficiaryNotFoundError();
    } else {
        await paymentRepo.add(payment);
        // if no schedule date is given, we should try to charge the payment straight away
        // TODO
    }
}