import mongoose, { Document } from 'mongoose';
export interface IMatch extends Document {
    players: mongoose.Types.ObjectId[];
    gameChallengeId: mongoose.Types.ObjectId;
    status: 'waiting' | 'ongoing' | 'completed' | 'cancelled';
    winner?: mongoose.Types.ObjectId;
    loser?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IMatch, {}, {}, {}, mongoose.Document<unknown, {}, IMatch, {}, {}> & IMatch & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Match.d.ts.map