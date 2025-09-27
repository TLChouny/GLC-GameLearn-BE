import mongoose, { Document } from 'mongoose';
export interface ILuckyWheelDailyBonus extends Document {
    wheelId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    dateKey: string;
    bonusSpins: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ILuckyWheelDailyBonus, {}, {}, {}, mongoose.Document<unknown, {}, ILuckyWheelDailyBonus, {}, {}> & ILuckyWheelDailyBonus & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=LuckyWheelDailyBonus.d.ts.map