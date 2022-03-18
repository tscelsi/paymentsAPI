import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import paymentRepo from "@repos/payment-repo";
import { PaymentNotFoundError, IncorrectPaymentFields, UnauthorisedError } from "@shared/errors";
import { getNew } from "@models/payment-model";
import { validateAndPersistPayment } from "@shared/validation";
// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    create: '/create',
    get: '/:payment_id',
    amend: '/:payment_id/amend',
    // schedule: '/:payment_id/schedule',
} as const;

/**
 * /payments/create
 * Create a new payment object
 */
router.post(p.create, async (req: Request, res: Response) => {
    // extract user from request headers, usually done in middleware for auth purposes but
    // for simplicity I just do it here.
    const { access_token } = req.headers;
    const { amount, description, receiving_user_id } = req.body;
    if (!amount || !description || !receiving_user_id) {
        throw new IncorrectPaymentFields();
    }
    // can use 'as string' in following as access_token will never be of type string[], see req.headers docs for more info
    const payment = getNew(access_token as string, amount, description, receiving_user_id);
    await validateAndPersistPayment(payment);
    // return success
    return res.status(OK).json(payment);
});

/**
 * Get a payment from /payments/:payment_id.
 */
 router.get(p.get, async (req: Request, res: Response) => {
    const { payment_id } = req.params;
    const payment = await paymentRepo.getOne(payment_id);
    if (!payment) {
        throw new PaymentNotFoundError()
    } else {
        return res.status(OK).json(payment);
    }
});

/**
 * Amend a pending or incomplete payment
 */
router.post(p.amend, async (req: Request, res: Response) => {
    const { payment_id } = req.params;
    const payment = await paymentRepo.getOne(payment_id);
    if (!payment) {
        throw new PaymentNotFoundError()
    } else {
        return res.status(OK).json(payment);
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
