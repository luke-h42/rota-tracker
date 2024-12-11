import mongoose from "mongoose";
const { Schema } = mongoose;
const shiftSchema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },  
    startTime: { type: String, required: true },
    endTime: { type: String, required: true }, 
    breakTime: {type: String, required: false},
    shiftDuration: {type: String, required: true},
    company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  },
  { timestamps: true }
);


const ShiftModel = mongoose.model('Shift', shiftSchema)

export default ShiftModel
