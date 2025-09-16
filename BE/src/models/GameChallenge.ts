import mongoose, { Document, Schema } from 'mongoose';

export interface IGameChallenge extends Document {
  title: string;
  subjectId: mongoose.Types.ObjectId;
  difficulty: 'easy' | 'medium' | 'hard';
  rewardPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

const GameChallengeSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  subjectId: {
    type: Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  rewardPoints: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

// Indexes
GameChallengeSchema.index({ subjectId: 1 });
GameChallengeSchema.index({ difficulty: 1 });
GameChallengeSchema.index({ rewardPoints: -1 });

export default mongoose.model<IGameChallenge>('GameChallenge', GameChallengeSchema);
