import mongoose, { Document } from 'mongoose';
export interface IHouseDecord extends Document {
    houseName: string;
    houseDescription: string;
    itemId: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IHouseDecord, {}, {}, {}, mongoose.Document<unknown, {}, IHouseDecord, {}, {}> & IHouseDecord & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=HouseDecord.d.ts.map