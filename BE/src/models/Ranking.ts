import mongoose, { Document, Schema } from 'mongoose';

export interface IRanking extends Document {
  userId: mongoose.Types.ObjectId;
  totalPoints: number;
  rank: number;
  season: string;
  createdAt: Date;
  updatedAt: Date;
}

const RankingSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalPoints: {
    type: Number,
    required: true,
    min: 0
  },
  rank: {
    type: Number,
    required: true,
    min: 1
  },
  season: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes
RankingSchema.index({ userId: 1 });
RankingSchema.index({ season: 1, rank: 1 });
RankingSchema.index({ totalPoints: -1 });

export default mongoose.model<IRanking>('Ranking', RankingSchema);
