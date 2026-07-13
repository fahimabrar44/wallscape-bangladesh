import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  productCode: string;
  image: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    altPhone?: string;
    email?: string;
  };
  shippingAddress: {
    division: string;
    district: string;
    area: string;
    fullAddress: string;
    deliveryNote?: string;
  };
  items: IOrderItem[];
  subtotal: number;
  deliveryCharge: number;
  grandTotal: number;
  paymentMethod: 'cod' | 'manual';
  paymentStatus: 'pending' | 'verified' | 'rejected';
  manualPayment?: {
    method: 'bKash' | 'Nagad' | 'Bank Transfer';
    transactionId: string;
    screenshot?: string;
  };
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  internalNotes?: string;
  isPaid: boolean;
  paidAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      altPhone: { type: String },
      email: { type: String },
    },
    shippingAddress: {
      division: { type: String, required: true },
      district: { type: String, required: true },
      area: { type: String, required: true },
      fullAddress: { type: String, required: true },
      deliveryNote: { type: String },
    },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        productCode: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true, default: 0 },
    grandTotal: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['cod', 'manual'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    manualPayment: {
      method: { type: String, enum: ['bKash', 'Nagad', 'Bank Transfer'] },
      transactionId: { type: String },
      screenshot: { type: String },
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    internalNotes: { type: String },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
    cancelReason: { type: String },
  },
  { timestamps: true }
);

orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'customer.phone': 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.model<IOrder>('Order', orderSchema);
