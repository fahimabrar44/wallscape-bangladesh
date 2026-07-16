import slugify from 'slugify';
import crypto from 'crypto';

export function generateSlug(text: string): string {
  return slugify(text, { lower: true, strict: true });
}

export function generateOrderNumber(): string {
  const prefix = 'WS';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export function generateProductCode(categorySlug: string): string {
  const prefix = categorySlug.substring(0, 3).toUpperCase();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}-${random}`;
}

export function calculateDeliveryCharge(subtotal: number, freeDeliveryMin: number, charge: number): number {
  return subtotal >= freeDeliveryMin ? 0 : charge;
}

export function paginate(page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit;
  return { skip, limit, page };
}

export function buildFilters(filters: Record<string, any>) {
  const query: Record<string, any> = {};
  if (filters.category) query.category = filters.category;
  if (filters.material) query.material = filters.material;
  if (filters.color) query.color = filters.color;
  if (filters.pattern) query.pattern = filters.pattern;
  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = parseFloat(filters.minPrice);
    if (filters.maxPrice) query.price.$lte = parseFloat(filters.maxPrice);
  }
  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: 'i' } },
      { tags: { $regex: filters.search, $options: 'i' } },
      { productCode: { $regex: filters.search, $options: 'i' } },
    ];
  }
  if (filters.isActive) query.isActive = filters.isActive === 'true';
  return query;
}

export function buildSort(sort: string = 'newest') {
  const sorts: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    'best-selling': { totalSold: -1 },
    name: { name: 1 },
  };
  return sorts[sort] || sorts.newest;
}
