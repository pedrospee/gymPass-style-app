import { app } from '@/app.js';
import { prisma } from '@/lib/prisma.js';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user.js';
import request from 'supertest';
import { describe, it, expect, afterAll, beforeAll } from 'vitest';


describe('Check-In Histoy (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });


    it('should be able to list the history of check-ins', async () => {
        const { token } = await createAndAuthenticateUser(app);

        const user = await prisma.user.findFirstOrThrow();

        const gym = await prisma.gym.create({
            data: {
                title: 'JavaScript Gym',
                latitude: -23.5344425,
                longitude: -46.6222736,
            },
        });

        await prisma.checkIn.createMany({
            data: [
                {
                    gymId: gym.id,
                    userId: user.id,
                },
                {
                    gymId: gym.id,
                    userId: user.id,
                },
            ]
        })

        const response = await request(app.server)
            .get('/check-ins/history')
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(response.statusCode).toEqual(200);
        expect(response.body.checkIns).toEqual([
            expect.objectContaining({
                gymId: gym.id,
                userId: user.id,
            }),
            expect.objectContaining({
                gymId: gym.id,
                userId: user.id,
            }),
        ]);
    });
});