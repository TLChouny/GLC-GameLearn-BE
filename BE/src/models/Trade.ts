import mongoose, { Document, Schema } from 'mongoose';

export interface ITrade extends Document {
  matchId: mongoose.Types.ObjectId;
  itemTaken: mongoose.Types.ObjectId;
  bookingId?: mongoose.Types.ObjectId;
  arvRegimenId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const TradeSchema: Schema = new Schema({
  matchId: {
    type: Schema.Types.ObjectId,
    ref: 'Match',
    required: true
  },
  itemTaken: {
    type: Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking'
  },
  arvRegimenId: {
    type: Schema.Types.ObjectId,
    ref: 'ArvRegimen'
  }
}, {
  timestamps: true
});

// Indexes
TradeSchema.index({ matchId: 1 });
TradeSchema.index({ itemTaken: 1 });

export default mongoose.model<ITrade>('Trade', TradeSchema);
