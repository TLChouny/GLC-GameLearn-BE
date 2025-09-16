import mongoose, { Document } from 'mongoose';
export interface ITrade extends Document {
    matchId: mongoose.Types.ObjectId;
    itemTaken: mongoose.Types.ObjectId;
    bookingId?: mongoose.Types.ObjectId;
    arvRegimenId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ITrade, {}, {}, {}, mongoose.Document<unknown, {}, ITrade, {}, {}> & ITrade & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Trade.d.ts.map