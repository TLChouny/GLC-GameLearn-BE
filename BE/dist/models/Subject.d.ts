import mongoose, { Document } from 'mongoose';
export interface ISubject extends Document {
    subjectName: string;
    subjectDescription: string;
    subjectUnit: string;
    lessonId?: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ISubject, {}, {}, {}, mongoose.Document<unknown, {}, ISubject, {}, {}> & ISubject & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Subject.d.ts.map