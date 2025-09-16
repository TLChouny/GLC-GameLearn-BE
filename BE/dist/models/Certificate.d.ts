import mongoose, { Document } from 'mongoose';
export interface ICertificate extends Document {
    certName: string;
    certDescription: string;
    gameChallengeId: mongoose.Types.ObjectId;
    matchId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ICertificate, {}, {}, {}, mongoose.Document<unknown, {}, ICertificate, {}, {}> & ICertificate & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Certificate.d.ts.map