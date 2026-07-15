import 'fastify';
import { IAdmin } from '../models/Admin';
import jwt from '@fastify/jwt';

declare module 'fastify' {
  interface FastifyRequest {
    admin?: IAdmin;
    user: { id: string; role: string; [key: string]: any };
    jwtVerify: () => Promise<any>;
    jwt: { sign: (payload: object, options?: object) => string };
  }
  interface FastifyReply {
    jwtSign: (payload: object, options?: object) => Promise<string>;
  }
}
