import { app } from '@/app.js';
import { prisma } from '@/lib/prisma.js';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user.js';
import request from 'supertest';
import { describe, it, expect, afterAll, beforeAll } from 'vitest';


describe('Validate Check-In (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });


    it('should be able to validate a check-in', async () => {
        const { token } = await createAndAuthenticateUser(app);

        const user = await prisma.user.findFirstOrThrow();

        const gym = await prisma.gym.create({
            data: {
                title: 'JavaScript Gym',
                latitude: -23.5344425,
                longitude: -46.6222736,
            },
        });

        let checkIn = await prisma.checkIn.create({
            data: {
                gymId: gym.id,
                userId: user.id,
            }
        })

        const response = await request(app.server)
            .patch(`/check-ins/${checkIn.id}/validate`)
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(response.statusCode).toEqual(204);

        checkIn = await prisma.checkIn.findUniqueOrThrow({
            where: {
                id: checkIn.id,
            },
        });
        expect(checkIn.validated_at).toEqual(expect.any(Date));
    });
});