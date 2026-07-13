import Fastify from 'fastify';
import mongoose from 'mongoose';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import helmet from '@fastify/helmet';
import formbody from '@fastify/formbody';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { config } from './config';
import { registerRoutes } from './routes';
import { errorHandler } from './middleware';

const app = Fastify({
  logger: config.nodeEnv === 'development',
});

async function start() {
  await app.register(helmet, { contentSecurityPolicy: false });
  await app.register(cors, { origin: config.corsOrigin, credentials: true });
  await app.register(formbody);
  await app.register(multipart, { limits: { fileSize: 5 * 1024 * 1024 } });
  await app.register(rateLimit, { max: 100, timeWindow: '1 minute' });
  await app.register(jwt, { secret: config.jwtSecret });

  await app.register(fastifyStatic, {
    root: path.join(__dirname, '../uploads'),
    prefix: '/uploads/',
    decorateReply: false,
  });

  app.setErrorHandler(errorHandler);

  // Declare admin property on FastifyRequest
  app.decorate('admin', null);

  await registerRoutes(app);

  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }

  try {
    await app.listen({ port: config.port, host: '0.0.0.0' });
    console.log(`Server running on http://localhost:${config.port}`);
  } catch (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
}

start();

export default app;
