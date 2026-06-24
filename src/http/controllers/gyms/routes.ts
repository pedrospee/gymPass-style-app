import type { FastifyInstance } from 'fastify';
import { verifyJwt } from '@/http/middlewares/verify-jwt.js';
import { nearby } from '@/http/controllers/gyms/nearby.js';
import { search } from '@/http/controllers/gyms/search.js';
import { create } from '@/http/controllers/gyms/create.js';

export async function gymsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJwt);

    app.get('/gyms/search', search);
    app.get('/gyms/nearby', nearby);

    app.post('/gyms', create);
}
