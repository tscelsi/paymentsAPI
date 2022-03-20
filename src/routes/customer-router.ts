import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import userRepo from "@repos/user-repo";
import { PaymentNotFoundError, IncorrectPaymentFields, UnauthorisedError } from "@shared/errors";
import { getNew } from "@models/payment-model";
import { amendPayment, charge, validatePayment } from "@shared/validation";
// Constants
const router = Router();
const { CREATED, OK } = StatusCodes;

// Paths
export const p = {
    getBalance: '/balance',
} as const;

/**
 * /customer/balance
 * Return an authed customers balance.
 */
router.get(p.getBalance, async (req: Request, res: Response) => {
    const { access_token } = req.headers;
    const user = await userRepo.getOne(access_token as string);
    return res.status(OK).json({ name: user?.name, balance: user?.balance });
});

// Export default
export default router;
