import { Router } from 'express';
import paymentRouter from './payment-router';
import { validateUser } from 'src/middleware/user';

// Export the base-router
const baseRouter = Router();

// Setup routers
baseRouter.use('/payments/', validateUser, paymentRouter);

// Export default.
export default baseRouter;
