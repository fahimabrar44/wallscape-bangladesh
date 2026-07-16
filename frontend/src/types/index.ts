export interface Product {
  _id: string;
  name: string;
  slug: string;
  productCode: string;
  category: Category | string;
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
  totalSold: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: Category | string;
  isActive: boolean;
  order: number;
}

export interface Order {
  _id: string;
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
  items: OrderItem[];
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
  orderStatus: OrderStatus;
  isPaid: boolean;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  productCode: string;
  image: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';

export interface Customer {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalOrders: number;
  totalPurchase: number;
  lastOrderDate?: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  product: Product | string;
  customerName: string;
  rating: number;
  review: string;
  isApproved: boolean;
  createdAt: string;
  tags?: string[];
  date?: string;
  name?: string;
  text?: string;
  location?: string;
  initials?: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image?: string;
  author: string;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  images: string[];
  clientName?: string;
  location?: string;
  completionDate?: string;
  isPublished: boolean;
}

export interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  mobileImage?: string;
  link?: string;
  buttonText?: string;
  isActive: boolean;
  order: number;
}

export interface Page {
  _id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
}

export interface Admin {
  _id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'manager';
  permissions: string[];
  isActive: boolean;
  lastLogin?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
