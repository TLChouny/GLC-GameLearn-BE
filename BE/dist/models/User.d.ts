import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=User.d.ts.map