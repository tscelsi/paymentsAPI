import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import paymentRepo from "@repos/payment-repo";
import { PaymentNotFoundError, IncorrectPaymentFields, UnauthorisedError } from "@shared/errors";
import { getNew } from "@models/payment-model";
import { amendPayment, charge, validatePayment } from "@shared/validation";
// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    create: '/create', //post
    getOne: '/:payment_id', //get
    amend: '/:payment_id/amend', //post
    getAll: '/', //get
} as const;

/**
 * /payments/create
 * Create a new payment object
 */
router.post(p.create, async (req: Request, res: Response) => {
    // extract user from request headers, usually done in middleware for auth purposes but
    // for simplicity I just do it here.
    const { access_token } = req.headers;
    const { amount, description, receiving_user_id, pay_date } = req.body;
    if (!amount || !description || !receiving_user_id) {
        // this if clause attends to Validation Rule #3 in the specs.
        throw new IncorrectPaymentFields();
    }
    // can use 'as string' in following as access_token will never be of type string[], see req.headers docs for more info
    validatePayment(access_token as string, amount, receiving_user_id, pay_date);
    // if no error has been thrown, then we can create a new payment object and attempt to charge.
    const payment = getNew(access_token as string, amount, description, receiving_user_id, pay_date);
    await charge(payment);
    return res.status(OK).json(payment);
});

router.get(p.getAll, async (req: Request, res: Response) => {
    const { access_token } = req.headers;
    const payments = await paymentRepo.getAll(access_token as string);
    return res.status(OK).json(payments);
})

/**
 * Get a payment from /payments/:payment_id.
 */
router.get(p.getOne, async (req: Request, res: Response) => {
    const { payment_id } = req.params;
    const payment = await paymentRepo.getOne(payment_id);
    if (!payment) {
        throw new PaymentNotFoundError()
    } else {
        return res.status(OK).json(payment);
    }
});

/**
 * /payments/:payment_id/amend
 * Amend a pending or incomplete payment
 */
router.post(p.amend, async (req: Request, res: Response) => {
    const { payment_id } = req.params;
    const { amount, description, receiving_user_id } = req.body;
    const payment = await paymentRepo.getOne(payment_id);
    if (!payment) {
        throw new PaymentNotFoundError()
    } else {
        const amendedPayment = await amendPayment(payment, { amount, description, receiving_user_id });
        return res.status(OK).json(amendedPayment);
    }
});


// /**
//  * Add one user.
//  */
// router.post(p.add, async (req: Request, res: Response) => {
//     const { user } = req.body;
//     // Check param
//     if (!user) {
//         throw new ParamMissingError();
//     }
//     // Fetch data
//     await userService.addOne(user);
//     return res.status(CREATED).end();
// });


// /**
//  * Update one user.
//  */
// router.put(p.update, async (req: Request, res: Response) => {
//     const { user } = req.body;
//     // Check param
//     if (!user) {
//         throw new ParamMissingError();
//     }
//     // Fetch data
//     await userService.updateOne(user);
//     return res.status(OK).end();
// });


// /**
//  * Delete one user.
//  */
// router.delete(p.delete, async (req: Request, res: Response) => {
//     const { id } = req.params;
//     // Check param
//     if (!id) {
//         throw new ParamMissingError();
//     }
//     // Fetch data
//     await userService.delete(Number(id));
//     return res.status(OK).end();
// });


// Export default
export default router;
