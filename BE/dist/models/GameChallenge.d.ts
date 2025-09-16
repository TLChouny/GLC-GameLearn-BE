import mongoose, { Document } from 'mongoose';
export interface IGameChallenge extends Document {
    title: string;
    subjectId: mongoose.Types.ObjectId;
    difficulty: 'easy' | 'medium' | 'hard';
    rewardPoints: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IGameChallenge, {}, {}, {}, mongoose.Document<unknown, {}, IGameChallenge, {}, {}> & IGameChallenge & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=GameChallenge.d.ts.map