import mongoose from "mongoose";
const { Schema } = mongoose;

// Define the company schema
const companySchema = new mongoose.Schema({
    name: { type: String, required: true },  // Company name
    admins: [{ type: Schema.Types.ObjectId, ref: 'User' }],  // Reference to admin users
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],  // Reference to regular users
    subscription: { type: Schema.Types.ObjectId, ref: 'Subscription'},  // Link to Subscription
}, { timestamps: true });

companySchema.methods.getUserLimit = async function () {
    // Fetch the subscription for the company and return the user limit
    const subscription = await mongoose.model('Subscription').findById(this.subscription);
    return subscription.usersLimit;
};

const CompanyModel = mongoose.model('Company', companySchema);

export default CompanyModel;
