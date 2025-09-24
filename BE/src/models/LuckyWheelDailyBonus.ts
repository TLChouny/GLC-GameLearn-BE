import mongoose, { Document, Schema } from 'mongoose';

export interface ILuckyWheelDailyBonus extends Document {
  wheelId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  dateKey: string; // YYYY-MM-DD
  bonusSpins: number; // tổng bonus cộng thêm trong ngày
  createdAt: Date;
  updatedAt: Date;
}

const LuckyWheelDailyBonusSchema: Schema = new Schema({
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
  dateKey: {
    type: String,
    required: true
  },
  bonusSpins: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

LuckyWheelDailyBonusSchema.index({ wheelId: 1, userId: 1, dateKey: 1 }, { unique: true });

export default mongoose.model<ILuckyWheelDailyBonus>('LuckyWheelDailyBonus', LuckyWheelDailyBonusSchema);


