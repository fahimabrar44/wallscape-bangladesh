import { FastifyError, FastifyRequest, FastifyReply } from 'fastify';

export function errorHandler(error: FastifyError, _request: FastifyRequest, reply: FastifyReply) {
  console.error(error);

  if (error.validation) {
    reply.status(400).send({
      message: 'Validation error',
      errors: error.validation,
    });
    return;
  }

  if (error.statusCode === 429) {
    reply.status(429).send({ message: 'Too many requests, please try again later' });
    return;
  }

  reply.status(error.statusCode || 500).send({
    message: error.message || 'Internal server error',
  });
}
