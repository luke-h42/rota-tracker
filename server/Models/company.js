import mongoose from "mongoose";
const { Schema } = mongoose;
const companySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    admins: [{ type: Schema.Types.ObjectId, ref: 'User' }],  
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],    
}, { timestamps: true });

const CompanyModel = mongoose.model('Company', companySchema)

export default CompanyModel