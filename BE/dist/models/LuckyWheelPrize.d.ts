import mongoose, { Document } from 'mongoose';
export interface ILuckyWheelPrize extends Document {
    wheelId: mongoose.Types.ObjectId;
    itemId?: mongoose.Types.ObjectId;
    prizeName: string;
    prizeType: 'item' | 'points' | 'coins' | 'special';
    prizeValue: number;
    probability: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ILuckyWheelPrize, {}, {}, {}, mongoose.Document<unknown, {}, ILuckyWheelPrize, {}, {}> & ILuckyWheelPrize & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=LuckyWheelPrize.d.ts.map