import mongoose, { Document, Schema } from 'mongoose';

export interface IMatch extends Document {
  players: mongoose.Types.ObjectId[];
  gameChallengeId: mongoose.Types.ObjectId;
  status: 'waiting' | 'ongoing' | 'completed' | 'cancelled';
  winner?: mongoose.Types.ObjectId;
  loser?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema: Schema = new Schema({
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  gameChallengeId: {
    type: Schema.Types.ObjectId,
    ref: 'GameChallenge',
    required: true
  },
  status: {
    type: String,
    enum: ['waiting', 'ongoing', 'completed', 'cancelled'],
    default: 'waiting'
  },
  winner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  loser: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
MatchSchema.index({ players: 1 });
MatchSchema.index({ gameChallengeId: 1 });
MatchSchema.index({ status: 1 });
MatchSchema.index({ winner: 1 });

export default mongoose.model<IMatch>('Match', MatchSchema);
