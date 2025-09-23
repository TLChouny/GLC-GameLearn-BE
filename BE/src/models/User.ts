import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  role: 'student' | 'admin' | 'teacher';
  avatar?: string;
  userDescription?: string;
  points: number;
  itemId?: mongoose.Types.ObjectId[];
  houseDecorId?: mongoose.Types.ObjectId[];
  gameChallengeId?: mongoose.Types.ObjectId[];
  matchId?: mongoose.Types.ObjectId[];
  certId?: mongoose.Types.ObjectId[];
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    totalScore: number;
    averageScore: number;
  };
  listFriend: mongoose.Types.ObjectId[];
  otp?: string;
  otpExpires?: Date;
  isVerified: boolean;
  token?: string;
  oauth?: {
    googleId?: string;
    facebookId?: string;
    provider?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  address: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'teacher'],
    default: 'student'
  },
  avatar: {
    type: String,
    default: ''
  },
  userDescription: {
    type: String,
    maxlength: 500
  },
  points: {
    type: Number,
    default: 0,
    min: 0
  },
  itemId: [{
    type: Schema.Types.ObjectId,
    ref: 'Item'
  }],
  houseDecorId: [{
    type: Schema.Types.ObjectId,
    ref: 'HouseDecor'
  }],
  gameChallengeId: [{
    type: Schema.Types.ObjectId,
    ref: 'GameChallenge'
  }],
  matchId: [{
    type: Schema.Types.ObjectId,
    ref: 'Match'
  }],
  certId: [{
    type: Schema.Types.ObjectId,
    ref: 'Certificate'
  }],
  stats: {
    gamesPlayed: { type: Number, default: 0 },
    gamesWon: { type: Number, default: 0 },
    totalScore: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 }
  },
  listFriend: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  otp: String,
  otpExpires: Date,
  isVerified: {
    type: Boolean,
    default: false
  },
  token: String,
  oauth: {
    googleId: String,
    facebookId: String,
    provider: String
  }
}, {
  timestamps: true
});

// Indexes for better performance (email and userName already have unique indexes)
UserSchema.index({ points: -1 });

export default mongoose.model<IUser>('User', UserSchema);
