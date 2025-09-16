import mongoose, { Document } from 'mongoose';
export interface ILesson extends Document {
    lessonName: string;
    lessonDescription: string;
    lessonNumber: number;
    lessonQuestion: string;
    lessonAnswer: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ILesson, {}, {}, {}, mongoose.Document<unknown, {}, ILesson, {}, {}> & ILesson & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Lesson.d.ts.map