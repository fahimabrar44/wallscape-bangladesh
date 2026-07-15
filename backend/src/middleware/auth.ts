import { FastifyRequest, FastifyReply } from 'fastify';
import { Admin } from '../models';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
    const decoded = request.user as { id: string; role: string };
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin || !admin.isActive) {
      reply.status(401).send({ message: 'Unauthorized' });
      return;
    }
    request.admin = admin;
  } catch {
    reply.status(401).send({ message: 'Invalid or expired token' });
  }
}

export function authorize(...roles: string[]) {
  return (request: FastifyRequest, reply: FastifyReply, done?: () => void) => {
    if (!request.admin || !roles.includes(request.admin.role)) {
      reply.status(403).send({ message: 'Forbidden' });
      return;
    }
    if (done) done();
  };
}
