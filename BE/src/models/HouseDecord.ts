import mongoose, { Document, Schema } from 'mongoose';

export interface IHouseDecord extends Document {
  houseName: string;
  houseDescription: string;
  itemId: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const HouseDecordSchema: Schema = new Schema({
  houseName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  houseDescription: {
    type: String,
    required: true,
    maxlength: 500
  },
  itemId: [{
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  }]
}, {
  timestamps: true
});

// Indexes
HouseDecordSchema.index({ houseName: 1 });

export default mongoose.model<IHouseDecord>('HouseDecord', HouseDecordSchema);
