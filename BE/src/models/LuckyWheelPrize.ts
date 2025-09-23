import mongoose, { Document, Schema } from 'mongoose';

export interface ILuckyWheelPrize extends Document {
  wheelId: mongoose.Types.ObjectId;
  itemId?: mongoose.Types.ObjectId;
  prizeName: string;
  prizeType: 'item' | 'points' | 'coins' | 'special';
  prizeValue: number;
  probability: number; // Xác suất từ 0-100
  createdAt: Date;
  updatedAt: Date;
}

const LuckyWheelPrizeSchema: Schema = new Schema({
  wheelId: {
    type: Schema.Types.ObjectId,
    ref: 'LuckyWheel',
    required: true
  },
  itemId: {
    type: Schema.Types.ObjectId,
    ref: 'Item'
  },
  prizeName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  prizeType: {
    type: String,
    enum: ['item', 'points', 'coins', 'special'],
    required: true
  },
  prizeValue: {
    type: Number,
    required: true,
    min: 0
  },
  probability: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Indexes
LuckyWheelPrizeSchema.index({ wheelId: 1 });
LuckyWheelPrizeSchema.index({ itemId: 1 });
LuckyWheelPrizeSchema.index({ prizeType: 1 });
LuckyWheelPrizeSchema.index({ probability: -1 });

export default mongoose.model<ILuckyWheelPrize>('LuckyWheelPrize', LuckyWheelPrizeSchema);
