import { FastifyRequest, FastifyReply } from 'fastify';
import { Customer } from '../models';

export async function getCustomers(request: FastifyRequest, reply: FastifyReply) {
  const query = request.query as any;
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const skip = (page - 1) * limit;
  const filter: any = {};
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { phone: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
    ];
  }
  const [customers, total] = await Promise.all([
    Customer.find(filter).sort({ totalPurchase: -1 }).skip(skip).limit(limit),
    Customer.countDocuments(filter),
  ]);
  reply.send({ customers, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}

export async function getCustomer(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const customer = await Customer.findById(id);
  if (!customer) {
    reply.status(404).send({ message: 'Customer not found' });
    return;
  }
  reply.send({ customer });
}
