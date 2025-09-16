import mongoose, { Document, Schema } from 'mongoose';

export interface ICertificate extends Document {
  certName: string;
  certDescription: string;
  gameChallengeId: mongoose.Types.ObjectId;
  matchId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema: Schema = new Schema({
  certName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  certDescription: {
    type: String,
    required: true,
    maxlength: 500
  },
  gameChallengeId: {
    type: Schema.Types.ObjectId,
    ref: 'GameChallenge',
    required: true
  },
  matchId: {
    type: Schema.Types.ObjectId,
    ref: 'Match',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
CertificateSchema.index({ gameChallengeId: 1 });
CertificateSchema.index({ matchId: 1 });
CertificateSchema.index({ certName: 1 });

export default mongoose.model<ICertificate>('Certificate', CertificateSchema);
