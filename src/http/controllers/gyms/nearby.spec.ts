import { app } from '@/app.js';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user.js';
import request from 'supertest';
import { describe, it, expect, afterAll, beforeAll } from 'vitest';

describe('Nearby Gyms (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });


    it('should be able to list nearby gyms', async () => {
        const { token } = await createAndAuthenticateUser(app, true);

        

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'JavaScript Gym',
                description: 'Some Gyms',
                phone: '9999999999',
                latitude: -23.5344425,
                longitude: -46.6222736,
            });

            await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'TypeScript Gym',
                description: 'Some Gyms',
                phone: '9999999999',
                latitude: -23.1895193,
                longitude: -46.9891007,
            });

            const response = await request(app.server)
                .get('/gyms/nearby')
                .query({
                    latitude: -23.5344425,
                    longitude: -46.6222736,
                })
                .set('Authorization', `Bearer ${token}`)
                .send();

        expect(response.statusCode).toEqual(200);
        expect(response.body.gyms).toHaveLength(1);
        expect(response.body).toEqual({
            gyms: [
                expect.objectContaining({
                    title: 'JavaScript Gym',
                }),
            ],
        });
    });
});