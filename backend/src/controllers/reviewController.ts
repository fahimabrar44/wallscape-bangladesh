import { FastifyRequest, FastifyReply } from 'fastify';
import { Review } from '../models';
import { reviewSchema } from '../schemas';

export async function getReviews(request: FastifyRequest, reply: FastifyReply) {
  const { product, isApproved } = request.query as any;
  const filter: any = {};
  if (product) filter.product = product;
  if (isApproved !== undefined) filter.isApproved = isApproved === 'true';
  const reviews = await Review.find(filter).populate('product', 'name slug').sort({ createdAt: -1 });
  reply.send({ reviews });
}

export async function createReview(request: FastifyRequest, reply: FastifyReply) {
  const data = reviewSchema.parse(request.body);
  const review = await Review.create(data);
  reply.status(201).send({ review });
}

export async function approveReview(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const review = await Review.findByIdAndUpdate(id, { isApproved: true }, { new: true });
  if (!review) {
    reply.status(404).send({ message: 'Review not found' });
    return;
  }
  reply.send({ review });
}

export async function deleteReview(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  await Review.findByIdAndDelete(id);
  reply.send({ message: 'Review deleted successfully' });
}
