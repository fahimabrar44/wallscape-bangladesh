import { FastifyRequest, FastifyReply } from 'fastify';
import { Blog } from '../models';
import { blogSchema } from '../schemas';
import { generateSlug, paginate } from '../utils/helpers';

export async function getBlogs(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query as any;
  const { skip, limit, page } = paginate(parseInt(query.page) || 1, parseInt(query.limit) || 20);
  const filter: any = {};
  if (query.isPublished !== undefined) filter.isPublished = query.isPublished === 'true';

  const [blogs, total] = await Promise.all([
    Blog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Blog.countDocuments(filter),
  ]);
  reply.send({ blogs, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}

export async function getBlog(request: FastifyRequest, reply: FastifyReply) {
  const { slug } = request.params as any;
  const blog = await Blog.findOne({ slug, isPublished: true });
  if (!blog) {
    reply.status(404).send({ message: 'Blog not found' });
    return;
  }
  reply.send({ blog });
}

export async function getBlogById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const blog = await Blog.findById(id);
  if (!blog) {
    reply.status(404).send({ message: 'Blog not found' });
    return;
  }
  reply.send({ blog });
}

export async function createBlog(request: FastifyRequest, reply: FastifyReply) {
  const data = blogSchema.parse(request.body);
  const slug = generateSlug(data.title);
  const blog = await Blog.create({ ...data, slug });
  reply.status(201).send({ blog });
}

export async function updateBlog(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const data = request.body as any;
  if (data.title) data.slug = generateSlug(data.title);
  const blog = await Blog.findByIdAndUpdate(id, data, { new: true });
  if (!blog) {
    reply.status(404).send({ message: 'Blog not found' });
    return;
  }
  reply.send({ blog });
}

export async function deleteBlog(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  await Blog.findByIdAndDelete(id);
  reply.send({ message: 'Blog deleted successfully' });
}
