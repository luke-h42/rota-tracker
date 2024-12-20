import mongoose from "mongoose";
const { Schema } = mongoose;
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true }, // This field is added for password authentication
        company: { type: Schema.Types.ObjectId, ref: 'Company', required: false }, // Reference to the company
        shifts: [{ type: Schema.Types.ObjectId, ref: 'Shift' }], // Reference to Shift model if using shifts
        role: {
            type: String,
            enum: ['user', 'admin', 'owner'], 
            default: 'user', // Default role is 'user'
          },
        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active', 
          },
          isVerified: { type: Boolean, default: false },
          verificationToken: { type: String }
      },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
