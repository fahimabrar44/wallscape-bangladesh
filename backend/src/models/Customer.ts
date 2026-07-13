import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalOrders: number;
  totalPurchase: number;
  lastOrderDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const customerSchema = new Schema<ICustomer>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    address: { type: String },
    totalOrders: { type: Number, default: 0 },
    totalPurchase: { type: Number, default: 0 },
    lastOrderDate: { type: Date },
  },
  { timestamps: true }
);

customerSchema.index({ phone: 1 });
customerSchema.index({ email: 1 });

export default mongoose.model<ICustomer>('Customer', customerSchema);
