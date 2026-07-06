import type { FastifyInstance } from 'fastify';
import { authenticate } from '@/http/controllers/users/authenticate.js';
import { register } from '@/http/controllers/users/register.js';
import { profile } from '@/http/controllers/users/profile.js';
import { verifyJwt } from '@/http/middlewares/verify-jwt.js';
import { refresh } from './refresh.js';


export async function usersRoutes(app: FastifyInstance) {
    app.post('/users', register);
    app.post('/sessions', authenticate);
    
    app.patch('/token/refresh', refresh);

    /** Authenticated */
    app.get('/me',  { onRequest: [verifyJwt] }, profile);
}
