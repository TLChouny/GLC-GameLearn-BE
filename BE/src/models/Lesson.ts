import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson extends Document {
  lessonName: string;
  lessonDescription: string;
  lessonNumber: number;
  lessonQuestion: string;
  lessonAnswer: string;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema: Schema = new Schema({
  lessonName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  lessonDescription: {
    type: String,
    required: true,
    maxlength: 1000
  },
  lessonNumber: {
    type: Number,
    required: true,
    min: 1
  },
  lessonQuestion: {
    type: String,
    required: true,
    maxlength: 1000
  },
  lessonAnswer: {
    type: String,
    required: true,
    maxlength: 1000
  }
}, {
  timestamps: true
});

// Indexes
LessonSchema.index({ lessonNumber: 1 });
LessonSchema.index({ lessonName: 1 });

export default mongoose.model<ILesson>('Lesson', LessonSchema);
