import { FastifyRequest, FastifyReply } from 'fastify';
import { Gallery } from '../models';

export async function getGalleryItems(request: FastifyRequest, reply: FastifyReply) {
  const { isPublished, category } = request.query as any;
  const filter: any = {};
  if (isPublished !== undefined) filter.isPublished = isPublished === 'true';
  if (category) filter.category = category;
  const items = await Gallery.find(filter).sort({ createdAt: -1 });
  reply.send({ items });
}

export async function createGalleryItem(request: FastifyRequest, reply: FastifyReply) {
  const data = request.body as any;
  const item = await Gallery.create(data);
  reply.status(201).send({ item });
}

export async function updateGalleryItem(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const data = request.body as any;
  const item = await Gallery.findByIdAndUpdate(id, data, { new: true });
  if (!item) {
    reply.status(404).send({ message: 'Gallery item not found' });
    return;
  }
  reply.send({ item });
}

export async function deleteGalleryItem(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  await Gallery.findByIdAndDelete(id);
  reply.send({ message: 'Gallery item deleted successfully' });
}
