/**
 * Ensure that payment information is valid and if it is, create the payment object.
 */

import { IPayment } from "@models/payment-model";
import {
    InvalidAmountError,
    BeneficiaryNotFoundError,
    PaymentNotFoundError,
    UserNotFoundError,
    PaymentAlreadyFinalisedError,
    InvalidDescriptionError
} from "@shared/errors";
import paymentRepo from "@repos/payment-repo";
import userRepo from "@repos/user-repo";

const isValidAmount = (amount: number): boolean => {
    if (amount < 0) {
        return false;
    } else {
        return true;
    }
}

const isValidUser = async (user_id: string): Promise<boolean> => {
    const user = await userRepo.persists(user_id);
    if (user) return true;
    else return false;
}

export const validateAndPersistPayment = async (payment: IPayment): Promise<void> => {
    if (!isValidAmount(payment.amount)) {
        throw new InvalidAmountError();
    } else if (!isValidUser(payment.receiving_user_id)) {
        throw new BeneficiaryNotFoundError();
    }
    await paymentRepo.add(payment);
    // if no schedule date is given, we should try to charge the payment straight away
    await charge(payment.payment_id);
}

export const charge = async (payment_id: string) => {
    // here we transfer the monetary amount between the two users contained in the payment transaction.
    const payment = await paymentRepo.getOne(payment_id);
    if (!payment) {
        throw new PaymentNotFoundError();
    }
    const payer = await userRepo.getOne(payment.user_id);
    const payee = await userRepo.getOne(payment.receiving_user_id);
    if (!payer || !payee) {
        throw new UserNotFoundError();
    }
    // TODO
}

interface Amendments {
    amount?: number,
    description?: string,
    receiving_user_id?: string
}

export const amendPayment = async (payment: IPayment, { amount, description, receiving_user_id }: Amendments): Promise<IPayment | null> => {
    if (payment.state === "incomplete" || payment.state === "pending") {
        // then we can amend the payment
        if (amount && !isValidAmount(amount)) throw new InvalidAmountError();
        else if (receiving_user_id && !isValidUser(receiving_user_id)) throw new BeneficiaryNotFoundError();
        else if (description === "") throw new InvalidDescriptionError();
        payment.amount = amount ? amount : payment.amount;
        payment.description = description ? description : payment.description
        payment.receiving_user_id = receiving_user_id ? receiving_user_id : payment.receiving_user_id
        payment.amended_at = new Date().toISOString()
        await paymentRepo.update(payment);
        const updatedPayment = await paymentRepo.getOne(payment.payment_id);
        return updatedPayment;
    } else {
        // payment is already finalised so we can no longer update it.
        throw new PaymentAlreadyFinalisedError();
    }
}