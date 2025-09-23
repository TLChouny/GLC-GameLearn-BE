import mongoose, { Document, Schema } from 'mongoose';

export interface ILuckyWheelSpin extends Document {
  wheelId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  prizeId?: mongoose.Types.ObjectId;
  spinResult: string;
  createdAt: Date;
  updatedAt: Date;
}

const LuckyWheelSpinSchema: Schema = new Schema({
  wheelId: {
    type: Schema.Types.ObjectId,
    ref: 'LuckyWheel',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  prizeId: {
    type: Schema.Types.ObjectId,
    ref: 'LuckyWheelPrize'
  },
  spinResult: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  }
}, {
  timestamps: true
});

// Indexes
LuckyWheelSpinSchema.index({ wheelId: 1, userId: 1 });
LuckyWheelSpinSchema.index({ userId: 1 });
LuckyWheelSpinSchema.index({ prizeId: 1 });
LuckyWheelSpinSchema.index({ createdAt: -1 });

export default mongoose.model<ILuckyWheelSpin>('LuckyWheelSpin', LuckyWheelSpinSchema);
