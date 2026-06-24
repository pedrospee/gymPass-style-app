import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js';
import { SearchGymsUseCase } from '@/use-cases/search-gyms.js';


let GymsRepository: InMemoryGymsRepository;
let sut: SearchGymsUseCase;

describe('Search Gyms Use Case', () => {
    beforeEach(async () => {
        GymsRepository = new InMemoryGymsRepository();
        sut = new SearchGymsUseCase(GymsRepository);

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should be able to search for gyms', async () => {
        await GymsRepository.create({
            title: 'JavaScript Gym',
            description: null,
            phone: '123456789',
            latitude: -23.5344425,
            longitude: -46.6222736,
        });

        await GymsRepository.create({
            title: 'Python Gym',
            description: null,
            phone: '123456789',
            latitude: -23.5344425,
            longitude: -46.6222736,
        });

        const { gyms } = await sut.execute({
            query: 'JavaScript',
            page: 1,
        });

        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'JavaScript Gym' }),
        ]);
    });

    it('should be able to fetch paginated gyms search', async () => {
        for (let i = 1; i <= 22; i++) {
            await GymsRepository.create({
            title: `JavaScript Gym ${i}`,
            description: null,
            phone: '123456789',
            latitude: -23.5344425,
            longitude: -46.6222736,
            });
        }

        const { gyms } = await sut.execute({
            query: 'JavaScript',
            page: 2,
        });

        expect(gyms).toHaveLength(2);
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'JavaScript Gym 21' }),
            expect.objectContaining({ title: 'JavaScript Gym 22' }),
        ]);
    });
});
