import { FastifyRequest, FastifyReply } from 'fastify';
import { Banner } from '../models';
import { bannerSchema } from '../schemas';

export async function getBanners(request: FastifyRequest, reply: FastifyReply) {
  const { isActive } = request.query as any;
  const filter: any = {};
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  const banners = await Banner.find(filter).sort({ order: 1 });
  reply.send({ banners });
}

export async function createBanner(request: FastifyRequest, reply: FastifyReply) {
  const data = bannerSchema.parse(request.body);
  const banner = await Banner.create(data);
  reply.status(201).send({ banner });
}

export async function updateBanner(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const data = request.body as any;
  const banner = await Banner.findByIdAndUpdate(id, data, { new: true });
  if (!banner) {
    reply.status(404).send({ message: 'Banner not found' });
    return;
  }
  reply.send({ banner });
}

export async function deleteBanner(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  await Banner.findByIdAndDelete(id);
  reply.send({ message: 'Banner deleted successfully' });
}
