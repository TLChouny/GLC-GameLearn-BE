import mongoose, { Document, Schema } from 'mongoose';

export interface ILuckyWheel extends Document {
  wheelTitle: string;
  wheelDescription: string;
  maxSpinPerDay: number;
  createdAt: Date;
  updatedAt: Date;
}

const LuckyWheelSchema: Schema = new Schema({
  wheelTitle: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  wheelDescription: {
    type: String,
    required: true,
    maxlength: 500
  },
  maxSpinPerDay: {
    type: Number,
    required: true,
    min: 1,
    default: 3
  }
}, {
  timestamps: true
});

// Indexes
LuckyWheelSchema.index({ wheelTitle: 1 });
LuckyWheelSchema.index({ maxSpinPerDay: 1 });

export default mongoose.model<ILuckyWheel>('LuckyWheel', LuckyWheelSchema);
