import mongoose, { Document } from 'mongoose';
export interface IItem extends Document {
    itemName: string;
    itemType: 'weapon' | 'armor' | 'consumable' | 'decoration' | 'special';
    itemPrice: number;
    itemImage: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IItem, {}, {}, {}, mongoose.Document<unknown, {}, IItem, {}, {}> & IItem & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Item.d.ts.map