import mongoose, { Document } from 'mongoose';
export interface ILuckyWheelSpin extends Document {
    wheelId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    prizeId?: mongoose.Types.ObjectId;
    spinResult: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ILuckyWheelSpin, {}, {}, {}, mongoose.Document<unknown, {}, ILuckyWheelSpin, {}, {}> & ILuckyWheelSpin & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=LuckyWheelSpin.d.ts.map