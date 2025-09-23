import mongoose, { Document } from 'mongoose';
export interface ILuckyWheel extends Document {
    wheelTitle: string;
    wheelDescription: string;
    maxSpinPerDay: number;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ILuckyWheel, {}, {}, {}, mongoose.Document<unknown, {}, ILuckyWheel, {}, {}> & ILuckyWheel & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=LuckyWheel.d.ts.map