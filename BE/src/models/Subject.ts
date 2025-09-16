import mongoose, { Document, Schema } from 'mongoose';

export interface ISubject extends Document {
  subjectName: string;
  subjectDescription: string;
  subjectUnit: string;
  lessonId?: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema: Schema = new Schema({
  subjectName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  subjectDescription: {
    type: String,
    required: true,
    maxlength: 500
  },
  subjectUnit: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lessonId: [{
    type: Schema.Types.ObjectId,
    ref: 'Lesson'
  }]
}, {
  timestamps: true
});

// Indexes
SubjectSchema.index({ subjectName: 1 });
SubjectSchema.index({ subjectUnit: 1 });

export default mongoose.model<ISubject>('Subject', SubjectSchema);
