import express from 'express';
import 'dotenv/config';
import cors from 'cors'
import { test, checkoutSession, stripeEvents } from '../Controllers/subscribeController.js'
import { roleCheck } from '../helpers/roleCheck.js'

const router = express.Router();
router.use(
    cors({
        credentials: true,
        origin: process.env.FRONTEND_URL
      
    })
)


router.post('/create-checkout-session', roleCheck('user', 'admin', 'owner'), checkoutSession) // Create subscription
router.post('/webhook', express.raw({ type: 'application/json' }), stripeEvents)

export default router;