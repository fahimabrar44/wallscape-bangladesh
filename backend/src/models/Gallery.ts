import mongoose, { Document, Schema } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  image: string;
  category: 'before' | 'after' | 'both';
  beforeImage?: string;
  afterImage?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const gallerySchema = new Schema<IGallery>(
  {
    title: { type: String, required: true },
    image: { type: String },
    category: { type: String, enum: ['before', 'after', 'both'], required: true },
    beforeImage: { type: String },
    afterImage: { type: String },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IGallery>('Gallery', gallerySchema);
