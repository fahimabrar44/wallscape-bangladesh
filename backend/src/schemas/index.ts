import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  image: z.string().optional(),
  parent: z.string().optional(),
  order: z.number().optional(),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }).optional(),
});

export const productSchema = z.object({
  name: z.string().min(2),
  category: z.string(),
  productCode: z.string().optional(),
  brand: z.string().optional(),
  material: z.string().optional(),
  color: z.string().optional(),
  pattern: z.string().optional(),
  rollSize: z.string().optional(),
  coverageArea: z.string().optional(),
  price: z.number().min(0),
  discountPrice: z.number().min(0).optional(),
  stock: z.number().min(0),
  images: z.array(z.string()).optional(),
  description: z.string().min(10),
  specifications: z.string().optional(),
  isInstallationAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isNewArrival: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }).optional(),
});

export const orderSchema = z.object({
  customer: z.object({
    name: z.string().min(2),
    phone: z.string().min(8),
    altPhone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
  }),
  shippingAddress: z.object({
    division: z.string().min(1),
    district: z.string().min(1),
    area: z.string().min(1),
    fullAddress: z.string().min(5),
    deliveryNote: z.string().optional(),
  }),
  items: z.array(z.object({
    productId: z.string(),
    name: z.string(),
    productCode: z.string(),
    image: z.string().optional().default(''),
    price: z.number(),
    quantity: z.number().min(1),
  })).min(1),
  subtotal: z.number(),
  deliveryCharge: z.number(),
  grandTotal: z.number(),
  paymentMethod: z.enum(['cod', 'manual']),
  manualPayment: z.object({
    method: z.enum(['bKash', 'Nagad', 'Bank Transfer']),
    transactionId: z.string().min(1),
    screenshot: z.string().optional(),
  }).optional(),
});

export const reviewSchema = z.object({
  product: z.string().optional(),
  customerName: z.string().min(2),
  rating: z.number().min(1).max(5),
  review: z.string().min(5),
});

export const blogSchema = z.object({
  title: z.string().min(5),
  excerpt: z.string().min(10),
  content: z.string().min(20),
  image: z.string().optional(),
  author: z.string().min(2),
  tags: z.array(z.string()).optional(),
  isPublished: z.boolean().optional(),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }).optional(),
});

export const pageSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(10),
  isPublished: z.boolean().optional(),
  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }).optional(),
});

export const bannerSchema = z.object({
  title: z.string().min(2),
  subtitle: z.string().optional(),
  image: z.string(),
  mobileImage: z.string().optional(),
  link: z.string().optional(),
  buttonText: z.string().optional(),
  isActive: z.boolean().optional(),
  order: z.number().optional(),
});

export const projectSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  category: z.string().min(2),
  images: z.array(z.string()).optional(),
  clientName: z.string().optional(),
  location: z.string().optional(),
  completionDate: z.string().optional(),
  isPublished: z.boolean().optional(),
});
