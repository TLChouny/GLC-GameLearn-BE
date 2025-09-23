import mongoose, { Document } from 'mongoose';
export interface IHouseDecor extends Document {
    houseName: string;
    houseDescription: string;
    itemId: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IHouseDecor, {}, {}, {}, mongoose.Document<unknown, {}, IHouseDecor, {}, {}> & IHouseDecor & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=HouseDecor.d.ts.map