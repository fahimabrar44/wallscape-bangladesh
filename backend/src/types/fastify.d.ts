import 'fastify';
import { IAdmin } from '../models/Admin';

declare module 'fastify' {
  interface FastifyRequest {
    admin?: IAdmin;
  }
}
