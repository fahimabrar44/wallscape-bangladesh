import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  productCode: string;
  category: mongoose.Types.ObjectId;
  brand?: string;
  material?: string;
  color?: string;
  pattern?: string;
  rollSize?: string;
  coverageArea?: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  description: string;
  specifications?: string;
  isInstallationAvailable: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  tags: string[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  totalSold: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    productCode: { type: String, required: true, unique: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: String, trim: true },
    material: { type: String, trim: true },
    color: { type: String, trim: true },
    pattern: { type: String, trim: true },
    rollSize: { type: String, trim: true },
    coverageArea: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    images: [{ type: String }],
    description: { type: String, required: true },
    specifications: { type: String },
    isInstallationAvailable: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    tags: [{ type: String, lowercase: true }],
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
    },
    totalSold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1, isFeatured: 1 });
productSchema.index({ price: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ totalSold: -1 });
productSchema.index({ createdAt: -1 });

export default mongoose.model<IProduct>('Product', productSchema);
