import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define price mapping for each plan
const planPrices = {
  basic: 1.99,
  standard: 4.99,
  premium: 9.99,
  pro: 19.99,
};

const subscriptionSchema = new mongoose.Schema({
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  plan: {
    type: String,
    enum: ['trial', 'basic', 'standard', 'premium', 'pro'],
    required: true,
  },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  trialEndDate: { type: Date },
  status: {
    type: String,
    enum: ['active', 'inactive', 'cancelled', 'past_due'],
    default: 'active',
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'pending', 'failed'],
    default: 'pending',
  },
  price: {
    type: Number,
    required: true,
    default: function () {
      return planPrices[this.plan] || 0; // Automatically assign the price based on the plan
    },
  },
  usersLimit: {
    type: Number,
    required: true,
    validate: {
      validator: function (v) {
        if (this.plan === 'basic') return v === 5;
        if (this.plan === 'standard') return v === 20;
        if (this.plan === 'premium') return v === 100;
        if (this.plan === 'pro') return v === 0; // Unlimited users for Pro
        return true;
      },
      message: (props) =>
        `Invalid number of users for the selected plan: ${props.value}`,
    },
  },
  stripeSubscriptionId: { type: String, required: true, default: 'trial'},
}, { timestamps: true });

const SubscriptionModel = mongoose.model('Subscription', subscriptionSchema);

export default SubscriptionModel;
