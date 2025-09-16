import mongoose, { Document } from 'mongoose';
export interface IRanking extends Document {
    userId: mongoose.Types.ObjectId;
    totalPoints: number;
    rank: number;
    season: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IRanking, {}, {}, {}, mongoose.Document<unknown, {}, IRanking, {}, {}> & IRanking & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Ranking.d.ts.map