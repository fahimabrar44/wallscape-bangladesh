import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  category: string;
  images: string[];
  clientName?: string;
  location?: string;
  completionDate?: Date;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    images: [{ type: String }],
    clientName: { type: String },
    location: { type: String },
    completionDate: { type: Date },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

projectSchema.index({ slug: 1 });
projectSchema.index({ isPublished: 1 });

export default mongoose.model<IProject>('Project', projectSchema);
