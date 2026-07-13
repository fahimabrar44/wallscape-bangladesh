import { FastifyRequest, FastifyReply } from 'fastify';
import { Admin } from '../models';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
    const admin = await Admin.findById(request.user.id).select('-password');
    if (!admin || !admin.isActive) {
      reply.status(401).send({ message: 'Unauthorized' });
      return;
    }
    request.admin = admin;
  } catch {
    reply.status(401).send({ message: 'Invalid or expired token' });
  }
}

export async function authorize(...roles: string[]) {
  return (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.admin || !roles.includes(request.admin.role)) {
      reply.status(403).send({ message: 'Forbidden' });
      return;
    }
  };
}
