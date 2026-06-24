import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js';
import { FetchNearbyGymsUseCase } from '@/use-cases/fetch-nearby-gyms.js';

let GymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe('Fetch Nearby Gyms Use Case', () => {
    beforeEach(async () => {
        GymsRepository = new InMemoryGymsRepository();
        sut = new FetchNearbyGymsUseCase(GymsRepository);

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should be able to fetch nearby gyms', async () => {
        await GymsRepository.create({
            title: 'Near Gym',
            description: null,
            phone: '123456789',
            latitude: -23.5344425,
            longitude: -46.6222736,
        });

        await GymsRepository.create({
            title: 'Near Gym',
            description: null,
            phone: '123456789',
            latitude: -23.1895193,
            longitude: -46.9891007,
        });

        const { gyms } = await sut.execute({
            userLatitude: -23.5344425,
            userLongitude: -46.6222736,
        });

        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Near Gym' }),
        ]);
    });
});
