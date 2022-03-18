import { Router } from 'express';
import paymentRouter from './payment-router';


// Export the base-router
const baseRouter = Router();

// Setup routers
baseRouter.use('/payments/', paymentRouter);

// Export default.
export default baseRouter;
