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
    InvalidDescriptionError,
    InsufficientFundsError
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

export const validatePayment = (from_user: string, amount: number, to_user: string): void => {
    if (!isValidAmount(amount)) {
        throw new InvalidAmountError();
    } else if (!isValidUser(from_user)) {
        throw new UserNotFoundError();
    } else if (!isValidUser(to_user)) {
        throw new BeneficiaryNotFoundError();
    }
}

export const persistPayment = async (payment: IPayment): Promise<void> => {
    // if no schedule date is given, we should try to charge the payment straight away
    await charge(payment);
}

export const charge = async (payment: IPayment): Promise<void> => {
    // here we transfer the monetary amount between the two users contained in the payment transaction.
    // before we transfer, we validate fields and account balance at charge time.
    const from_user = await userRepo.getOne(payment.user_id);
    const to_user = await userRepo.getOne(payment.receiving_user_id);
    if (!from_user || !to_user) {
        // we will also terminate payment as incomplete due to this error, either the from_user has removed their account,
        // else the to_user (payee) doesn't exist. In either case, we're done with this payment unless amended.
        payment.state = "incomplete";
        paymentRepo.update(payment);
        throw new UserNotFoundError();
    }
    // validate balance
    if (from_user.balance < payment.amount) {
        // terminate the payment as incomplete
        payment.state = "incomplete";
        paymentRepo.update(payment);
        throw new InsufficientFundsError();
    } else {
        // update the balances in the user accounts
        from_user.balance = from_user.balance - payment.amount;
        to_user.balance = to_user.balance + payment.amount;
        payment.state = "successful";
        // we just bunch all the updates together, this can be fleshed out for better, more error-catching behaviour.
        // e.g. refactored into another function and better error catching.
        // we only add the payment object if all validation is successful and user balance updates are successful.
        userRepo.update(from_user)
        .then(() => userRepo.update(to_user))
        .then(() => paymentRepo.add(payment))
    }
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