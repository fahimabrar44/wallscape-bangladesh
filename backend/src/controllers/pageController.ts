import { FastifyRequest, FastifyReply } from 'fastify';
import { Page } from '../models';
import { pageSchema } from '../schemas';
import { generateSlug } from '../utils/helpers';

export async function getPages(request: FastifyRequest, reply: FastifyReply) {
  const { isPublished } = request.query as any;
  const filter: any = {};
  if (isPublished !== undefined) filter.isPublished = isPublished === 'true';
  const pages = await Page.find(filter).sort({ title: 1 });
  reply.send({ pages });
}

export async function getPage(request: FastifyRequest, reply: FastifyReply) {
  const { slug } = request.params as any;
  const page = await Page.findOne({ slug, isPublished: true });
  if (!page) {
    reply.status(404).send({ message: 'Page not found' });
    return;
  }
  reply.send({ page });
}

export async function createPage(request: FastifyRequest, reply: FastifyReply) {
  const data = pageSchema.parse(request.body);
  const slug = generateSlug(data.title);
  const page = await Page.create({ ...data, slug });
  reply.status(201).send({ page });
}

export async function updatePage(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const data = request.body as any;
  if (data.title) data.slug = generateSlug(data.title);
  const page = await Page.findByIdAndUpdate(id, data, { new: true });
  if (!page) {
    reply.status(404).send({ message: 'Page not found' });
    return;
  }
  reply.send({ page });
}

export async function deletePage(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  await Page.findByIdAndDelete(id);
  reply.send({ message: 'Page deleted successfully' });
}
