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
    InsufficientFundsError,
    InvalidDateError
} from "@shared/errors";
import paymentRepo from "@repos/payment-repo";
import userRepo from "@repos/user-repo";
import { IUser } from "@models/user-model";
import { getNextBusinessDate, setTimeZero } from "./functions";

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

export const isValidPayDate = (pay_date: string) => {
    // check if pay date is of valid format and also is a time in the future.
    // YYYY-MM-DD
    let pattern = /^\d{4}-\d{2}-\d{2}$/;
    if (!pattern.test(pay_date)) return false;
    let diff: number;
    let date = new Date(pay_date);
    let now = new Date();
    setTimeZero(now);
    diff = date.getTime() - now.getTime()
    if (diff >= 0) {
        return true;
    } else {
        return false;
    }
}

export const validatePayment = (from_user: string, amount: number, to_user: string, pay_date?: string): void => {
    if (!isValidAmount(amount)) throw new InvalidAmountError(); 
    else if (!isValidUser(from_user)) throw new UserNotFoundError();
    else if (!isValidUser(to_user)) throw new BeneficiaryNotFoundError();
    else if (pay_date && !isValidPayDate(pay_date)) throw new InvalidDateError();
}

/**
 * This function checks to see if the payment date requires an immediate transaction or if we should schedule the payment
 * for a time in the future. An immediate transaction should take place if the pay_date is within two business days of current day.
 * @param pay_date
 */
export const isScheduledPayment = (pay_date: Date) => {
    // if pay date is payable today or next business day, then it is not a scheduled payment
    // i.e. if pay date is less than the next business day date
    let pay_date_copy = new Date(pay_date.getTime())
    setTimeZero(pay_date_copy);
    const now = new Date();
    const nextBusinessDayFromNow = getNextBusinessDate(now);
    if ((pay_date_copy.getTime() - nextBusinessDayFromNow.getTime()) <= 0) {
        return false;
    } else {
        return true;
    }
}

/**
 * This function validates and, if successfully validated, adds funds to the receiving user account
 * and removes funds from the paying user account.
 * @param payment 
 */
export const charge = async (payment: IPayment): Promise<void> => {
    console.log(payment);
    // here we transfer the monetary amount between the two users contained in the payment transaction.
    // before we transfer, we validate fields and account balance at charge time.
    const from_user = await userRepo.getOne(payment.user_id);
    const to_user = await userRepo.getOne(payment.receiving_user_id);
    if (!from_user || !to_user) {
        // we will also terminate payment as incomplete due to this error, either the from_user has removed their account,
        // else the to_user (payee) doesn't exist. In either case, we're done with this payment unless amended.
        throw new UserNotFoundError();
    }
    // validate balance
    if (from_user.balance < payment.amount) {
        throw new InsufficientFundsError();
    } else if (isScheduledPayment(payment.pay_date)) {
        // it is a scheduled payment and the transaction shouldn't yet take place
        paymentRepo.add(payment);
    } else {
        // update the balances in the user accounts
        return execTransaction(payment, from_user, to_user);
    }
}

const execTransaction = (payment: IPayment, from_user: IUser, to_user: IUser) => {
    from_user.balance = from_user.balance - payment.amount;
    to_user.balance = to_user.balance + payment.amount;
    payment.state = "successful";
    // we just bunch all the updates together, this can be fleshed out for better, more error-catching behaviour.
    // e.g. refactored into another function and better error catching.
    // we only add the payment object if all validation is successful and user balance updates are successful.
    return userRepo.update(from_user)
        .then(() => userRepo.update(to_user))
        .then(() => paymentRepo.add(payment))
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