import { FastifyRequest, FastifyReply } from 'fastify';
import { Category, Product } from '../models';
import { categorySchema } from '../schemas';
import { generateSlug } from '../utils/helpers';

export async function getCategories(request: FastifyRequest, reply: FastifyReply) {
  const { isActive } = request.query as any;
  const filter: any = {};
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  const categories = await Category.find(filter).populate('parent', 'name slug').sort({ order: 1, name: 1 });
  reply.send({ categories });
}

export async function getCategory(request: FastifyRequest, reply: FastifyReply) {
  const { slug } = request.params as any;
  const category = await Category.findOne({ slug }).populate('parent', 'name slug');
  if (!category) {
    reply.status(404).send({ message: 'Category not found' });
    return;
  }
  reply.send({ category });
}

export async function createCategory(request: FastifyRequest, reply: FastifyReply) {
  const data = categorySchema.parse(request.body);
  const slug = generateSlug(data.name);
  const category = await Category.create({ ...data, slug });
  reply.status(201).send({ category });
}

export async function updateCategory(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const data = request.body as any;
  if (data.name) {
    data.slug = generateSlug(data.name);
  }
  const category = await Category.findByIdAndUpdate(id, data, { new: true });
  if (!category) {
    reply.status(404).send({ message: 'Category not found' });
    return;
  }
  reply.send({ category });
}

export async function deleteCategory(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const productsCount = await Product.countDocuments({ category: id });
  if (productsCount > 0) {
    reply.status(400).send({ message: `Cannot delete category with ${productsCount} products` });
    return;
  }
  await Category.findByIdAndDelete(id);
  reply.send({ message: 'Category deleted successfully' });
}
