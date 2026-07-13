import { FastifyRequest, FastifyReply } from 'fastify';
import { Product } from '../models';
import { productSchema } from '../schemas';
import { generateSlug, generateProductCode, buildFilters, buildSort, paginate } from '../utils/helpers';

export async function getProducts(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query as any;
  const { skip, limit, page } = paginate(parseInt(query.page) || 1, parseInt(query.limit) || 20);
  const filter = buildFilters(query);
  const sort = buildSort(query.sort);

  const [products, total] = await Promise.all([
    Product.find(filter).populate('category', 'name slug').sort(sort).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  reply.send({
    products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
}

export async function getProduct(request: FastifyRequest, reply: FastifyReply) {
  const { slug } = request.params as any;
  const product = await Product.findOne({ slug }).populate('category', 'name slug description');
  if (!product) {
    reply.status(404).send({ message: 'Product not found' });
    return;
  }
  reply.send({ product });
}

export async function getProductById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const product = await Product.findById(id).populate('category', 'name slug');
  if (!product) {
    reply.status(404).send({ message: 'Product not found' });
    return;
  }
  reply.send({ product });
}

export async function createProduct(request: FastifyRequest, reply: FastifyReply) {
  const data = productSchema.parse(request.body);
  const slug = generateSlug(data.name);
  const count = await Product.countDocuments();
  const productCode = data.productCode || `WS-${String(count + 1).padStart(5, '0')}`;
  const product = await Product.create({ ...data, slug, productCode });
  reply.status(201).send({ product });
}

export async function updateProduct(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const data = request.body as any;
  if (data.name) {
    data.slug = generateSlug(data.name);
  }
  const product = await Product.findByIdAndUpdate(id, data, { new: true });
  if (!product) {
    reply.status(404).send({ message: 'Product not found' });
    return;
  }
  reply.send({ product });
}

export async function deleteProduct(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  await Product.findByIdAndDelete(id);
  reply.send({ message: 'Product deleted successfully' });
}

export async function getFeaturedProducts(_request: FastifyRequest, reply: FastifyReply) {
  const products = await Product.find({ isFeatured: true, isActive: true })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(12);
  reply.send({ products });
}

export async function getNewArrivals(_request: FastifyRequest, reply: FastifyReply) {
  const products = await Product.find({ isNewArrival: true, isActive: true })
    .populate('category', 'name slug')
    .sort({ createdAt: -1 })
    .limit(12);
  reply.send({ products });
}

export async function getBestSellers(_request: FastifyRequest, reply: FastifyReply) {
  const products = await Product.find({ isActive: true })
    .populate('category', 'name slug')
    .sort({ totalSold: -1 })
    .limit(12);
  reply.send({ products });
}

export async function getRelatedProducts(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const product = await Product.findById(id);
  if (!product) {
    reply.status(404).send({ message: 'Product not found' });
    return;
  }
  const products = await Product.find({
    _id: { $ne: id },
    category: product.category,
    isActive: true,
  })
    .populate('category', 'name slug')
    .limit(8);
  reply.send({ products });
}

export async function searchProducts(request: FastifyRequest, reply: FastifyReply) {
  const { q } = request.query as any;
  if (!q) {
    reply.send({ products: [] });
    return;
  }
  const products = await Product.find({
    isActive: true,
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } },
      { productCode: { $regex: q, $options: 'i' } },
    ],
  })
    .populate('category', 'name slug')
    .limit(20);
  reply.send({ products });
}
