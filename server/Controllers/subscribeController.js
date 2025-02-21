import Stripe from 'stripe';
import 'dotenv/config';
import User from '../Models/user.js'
import Subscription from '../Models/subscription.js'
import Company from '../Models/company.js'
import jwt from 'jsonwebtoken'

import {sendEmail} from '../helpers/emailHelper.js'
import { sendTestEmail } from '../helpers/testEmail.js'
const useTestEmails = process.env.USE_TEST_EMAILS === 'true';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const prodIds = {
  'prod_Rb7raxS6IwVEHL': 'basic',
  'prod_Rb7rWMVogPpMIP' : 'standard',
  'prod_Rb7rVnUXsB6QOx': 'premium',
  'prod_Rb7rDOGjoxGYiL': 'pro'
};

export const test = (req,res) => {
    res.json('test is working')
}

export const checkoutSession = async (req, res) => {
    const { plan } = req.body
 
    const priceIds = {
        basic: 'price_1QhvbNBzdw859R7th5rddpte',
        standard: 'price_1QhvbcBzdw859R7tZvcPE7wu',
        premium: 'price_1QhvbmBzdw859R7tZG0EsBOR',
        pro: 'price_1QhvbvBzdw859R7t2JC0QrJg',
      };


      const priceId = priceIds[plan];
     
      if (!priceId) {
        return res.status(400).json({ error: 'Invalid plan' });
      }
      try {
        const { token } = req.cookies;
        if (!token) {
          return res.status(401).json({ error: 'Unauthorised: Token is missing' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
          return res.status(401).json({ error: 'Unauthorised: Invalid token' });
        }

        const userId = decoded.id;

        const user = await User.findById(userId).populate('company');

        if (!user || !user.company) {
          return res.status(404).json({ error: 'User or company not found' });
        }
    
        const companyId = user.company._id;

        const successUrl = `${process.env.FRONTEND_URL}/subscription-success`;
        const cancelURL = `${process.env.FRONTEND_URL}/subscribe?cancelled-checkout`;
        // Create a checkout session with the selected price ID
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          mode: 'subscription',
          success_url: successUrl,  // URL after successful payment
          cancel_url: cancelURL,  // URL if the user cancels
          metadata: {
            companyId: companyId.toString(),
            plan: plan.toString(), 
          },
        });
        if(!session.url) {
          return res.status(500).json({message: "Error creating stripe session"})
        }
        // Send the session ID to the frontend
        res.json({ sessionUrl: session.url });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create checkout session' });
      }
}

export const stripeEvents = async (req, res ) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed', err);
    return res.status(400).send('Webhook error: ' + err.message);
  }

  switch (event.type) {
    // Checkout session completed
    case "checkout.session.completed":
      const createdInvoice = event.data.object;
      try {
        await handlePaymentSuccess(createdInvoice, createdInvoice.metadata.companyId, createdInvoice.metadata.plan);
        res.status(200).send('Success');
      } catch (err) {
        console.error('Error handling payment success for created subscription', err);
      }
      break;

    // Subscription updated or renewed
    case "customer.subscription.updated":
      const subId = event.data.object.id;
      try {
        await handleSubscriptionUpdate(subId, event.data.object.items.data[0].plan.product)
        res.status(200).send('Success');
      } catch (err) {
        console.error('Error handling subscription update', err);
      }
      break;

    // Subscription cancelled or ended
    case "customer.subscription.deleted":
      const subscriptionId = event.data.object.id;
      try {
        await handleSubscriptionDeleted(subscriptionId);
        res.status(200).send('Success');
      } catch (err) {
        console.error('Error handling subscription deletion', err);
      }
      break;

    // Payment failed
      case "invoice.payment_failed":
        const subscriptionIdentification = event.data.object.subscription;
        try {
          await handlePaymentFailure(subscriptionIdentification);
          res.status(200).send('Success');
        } catch (err) {
          console.error('Error handling payment failure', err);
        }
        break;
        
    default:
      console.log(`Unhandled event type ${event.type}`)
  }
}


const handlePaymentSuccess = async (invoice, companyId, plan) => {
  try {
    // Get the company using the companyId from metadata
    const company = await Company.findById(companyId);
    if (!company) {
      throw new Error('Company not found');
    }

    // Extract the subscription level from the invoice or metadata

    
    const planName = plan; 

    // Find the subscription document related to the company
    const subscription = await Subscription.findOne({ company: companyId });  

    if (!subscription) {
      throw new Error('Subscription not found for this company');
    }

    // Update subscription plan based on the payment
    subscription.plan = planName;  // Update to the paid plan
    subscription.paymentStatus = 'paid';  // Mark as paid
    subscription.stripeSubscriptionId = invoice.subscription;  // Store the Stripe subscription ID
    subscription.status = 'active';  // Activate the subscription
    subscription.startDate = new Date();  // Set the start date to the current date
    subscription.trialEndDate = null;
    subscription.updatedAt = new Date();

    // Set the end date based on the selected plan (for simplicity, using 30 days here)
    const subscriptionDuration = {
      basic: 30,
      standard: 30,
      premium: 30,
      pro: 30,
    };

    subscription.endDate = new Date(new Date().setDate(new Date().getDate() + subscriptionDuration[plan]));

    // Update the users limit based on the plan
    subscription.usersLimit = plan === 'pro' ? 0 : plan === 'premium' ? 100 : plan === 'standard' ? 20 : 5;

    // Save the updated subscription
    await subscription.save();

    // Update the company subscription reference
    company.subscription = subscription._id;
    await company.save();

    console.log('Subscription updated successfully for company:', companyId);
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw new Error('Failed to update subscription after payment');
  }
};

// Handle subscription update including renewals
const handleSubscriptionUpdate = async (subId,  plan) => {
  try {
    // Find the subscription by its Stripe subscription ID
    const subscription = await Subscription.findOne({ stripeSubscriptionId: subId }).populate('company');

    if (!subscription) {
      console.log('Skipping subscription update due to incomplete session');
      return 
    }
    if(!subscription.company_id) {
      throw new Error('Company Id not found')
    }
    // Map the received plan (which is actually the product ID) to your internal plan
    const planName = prodIds[plan];  // Using prodIds to get the plan name from the product ID

    // If the plan has changed, update the subscription
    if (subscription.plan !== planName) {
      subscription.plan = planName;  // Update the plan
      subscription.usersLimit = getUserLimit(planName); // Update user limit
    }

    const subscriptionDuration = {
      basic: 30,
      standard: 30,
      premium: 30,
      pro: 30,
    };

    // Set the end date based on the selected plan
    subscription.endDate = new Date(new Date().setDate(new Date().getDate() + subscriptionDuration[planName]));

    // Save the updated subscription
    await subscription.save();

    console.log('Subscription updated successfully for company:', subscription.company_id);
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw new Error('Failed to update subscription after payment');
  }
};

// Helper function to get the user limit based on plan
const getUserLimit = (plan) => {
  switch (plan) {
    case 'pro':
      return 0;  // Unlimited users for 'pro'
    case 'premium':
      return 100;
    case 'standard':
      return 20;
    case 'basic':
      return 5;
    default:
      return 0;  // Default case (shouldn't happen)
  }
};



// Handle subscription deletion (for cancellation or ended subscription)
const handleSubscriptionDeleted = async (subscriptionId) => {
  const subscription = await Subscription.findOne({ stripeSubscriptionId: subscriptionId });
  if (!subscription) {
    throw new Error('Subscription not found for this company');
  }

  // Update subscription status to inactive 
  subscription.status = 'inactive';
  await subscription.save();
  console.log('Subscription made inactive for subscription:', subscriptionId);
};

// Handle payment failure (for retries, notifications, etc.)
const handlePaymentFailure = async (subscriptionIdentification) => {
  // Handle payment failure scenarios here, such as sending notification emails
  const subscription = await Subscription.findOne({ stripeSubscriptionId: subscriptionIdentification });
  if (subscription) {
    subscription.status = 'past_due';
    await subscription.save();
    // add email to notify customer
  }
  console.log('Subscription has insufficient funding for subscription:', subscriptionIdentification);
};