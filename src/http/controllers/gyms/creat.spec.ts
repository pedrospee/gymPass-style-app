import { app } from '@/app.js';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user.js';
import request from 'supertest';
import { describe, it, expect, afterAll, beforeAll } from 'vitest';

describe('Create Gym (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });


    it('should be able to create a gym', async () => {
        const { token } = await createAndAuthenticateUser(app);

        const response = await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'JavaScript Gym',
                description: 'Some Gyms',
                phone: '9999999999',
                latitude: -23.5344425,
                longitude: -46.6222736,
            });

        expect(response.statusCode).toEqual(201);
    });
});
