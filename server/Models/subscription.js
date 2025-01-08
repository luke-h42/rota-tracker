import mongoose from 'mongoose';
const { Schema } = mongoose;

const subscriptionSchema = new mongoose.Schema({
    company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },  // Reference to Company
    plan: { 
        type: String, 
        enum: ['trial', 'basic', 'standard', 'premium', 'pro'],  // List of available plans
        required: true 
    },  // Subscription plan (trial, basic, standard, premium, pro)
    startDate: { type: Date, default: Date.now },  // Subscription start date
    endDate: { type: Date },  // Subscription end date
    trialEndDate: { type: Date },  // Date when the trial ends
    status: { 
        type: String, 
        enum: ['active', 'inactive', 'cancelled'], 
        default: 'active' 
    },  // Status of the subscription
    paymentStatus: { 
        type: String, 
        enum: ['paid', 'pending', 'failed'], 
        default: 'pending' 
    },  // Payment status
    price: { type: Number, required: true },  // Price of the subscription
    usersLimit: { 
        type: Number, 
        required: true, 
        validate: {
            validator: function(v) {
                if (this.plan === 'basic') return v === 5;
                if (this.plan === 'standard') return v === 20;
                if (this.plan === 'premium') return v === 100;
                if (this.plan === 'pro') return v === 0;  // Unlimited users for Pro
                return true;
            },
            message: props => `Invalid number of users for the selected plan: ${props.value}`
        }
    }  // Number of users allowed for the plan (5 for Basic, 20 for Standard, 100 for Premium, unlimited for Pro)
}, { timestamps: true });

const SubscriptionModel = mongoose.model('Subscription', subscriptionSchema);

export default SubscriptionModel;
