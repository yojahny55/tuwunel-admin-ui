import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import staticPlugin from '@fastify/static';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import authRoutes from './routes/auth.js';
import matrixRoutes from './routes/matrix.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = Fastify({ logger: true });

// CORS
await app.register(cors, { origin: true });

// JWT
await app.register(jwt, { secret: process.env.JWT_SECRET || 'dev-secret-change-me' });

// Auth decorator
app.decorate('authenticate', async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized' });
  }
});

// Routes
app.register(authRoutes, { prefix: '/api' });
app.register(matrixRoutes, { prefix: '/api' });
app.register(adminRoutes, { prefix: '/api' });

// Serve frontend static files in production
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
app.register(staticPlugin, {
  root: frontendDist,
  prefix: '/',
  decorateReply: false,
});

// SPA fallback
app.setNotFoundHandler((request, reply) => {
  if (!request.url.startsWith('/api')) {
    reply.sendFile('index.html');
  } else {
    reply.code(404).send({ error: 'Not found' });
  }
});

const start = async () => {
  const port = process.env.PORT || 3001;
  try {
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`Tuwunel Admin API running on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
