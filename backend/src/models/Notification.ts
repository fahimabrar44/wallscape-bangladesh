import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  type: 'new_order' | 'payment' | 'review' | 'contact' | 'system';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    type: {
      type: String,
      enum: ['new_order', 'payment', 'review', 'contact', 'system'],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ isRead: 1, createdAt: -1 });

export default mongoose.model<INotification>('Notification', notificationSchema);
