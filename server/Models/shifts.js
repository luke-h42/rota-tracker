import mongoose from "mongoose";
const { Schema } = mongoose;
const shiftSchema = new mongoose.Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
      },
  { timestamps: true } 
);

const ShiftModel = mongoose.model('Shift', shiftSchema)

export default ShiftModel
