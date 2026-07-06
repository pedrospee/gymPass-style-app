import fastify from 'fastify';
import fastifyJWT from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';
import { usersRoutes } from '@/http/controllers/users/routes.js';
import { ZodError } from 'zod';
import { env } from '@/env/index.js';
import { gymsRoutes } from '@/http/controllers/gyms/routes.js';
import { checkInsRoutes } from '@/http/controllers/check-ins/routes.js';

export const app = fastify();

app.register(fastifyCookie);

app.register(fastifyJWT, {
    secret: env.JWT_SECRET,
    cookie: {
        cookieName: 'refreshToken',
        signed: false,
    },
    sign: {
        expiresIn: '10m',
    },
});

app.register(usersRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);

app.setErrorHandler((error, _, reply) => {
    if (error instanceof ZodError) {
        return reply.status(400).send({
            message: 'Validation error.',
            issues: error.format(),
        });
    }

    if (env.NODE_ENV === 'dev') {
        console.error(error);
    } else {
        // TODO: Here we should log the error in an external tool like DataDog/NewRelic/Sentry
    }

    return reply.status(500).send({
        message: 'Internal server error.'
    });
});
