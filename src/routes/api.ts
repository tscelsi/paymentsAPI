import { Router } from 'express';
import paymentRouter from './payment-router';
import customerRouter from "./customer-router";
import { validateUser } from 'src/middleware/user';

// Export the base-router
const baseRouter = Router();

// Setup routers
baseRouter.use('/payments/', validateUser, paymentRouter);
baseRouter.use('/customer/', validateUser, customerRouter);

// Export default.
export default baseRouter;
