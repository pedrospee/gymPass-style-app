import { expect, describe, it, beforeEach, afterEach, vi}  from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository.js";
import { FetchUserCheckInsHistoryUseCase } from "./fetch-user-check-ins-history.js";


let checkInsRepository: InMemoryCheckInsRepository;
let sut: FetchUserCheckInsHistoryUseCase;

describe("Fetch User Check-ins History Use Case", () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository)

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it("should be able to fetch check-ins history", async () => {
        await checkInsRepository.create({
            gymId: "gym-1",
            userId: "user-1",
        })

        await checkInsRepository.create({
            gymId: "gym-2",
            userId: "user-1",
        })

        const { checkIns } = await sut.execute({
            userId: "user-1",
            page: 1,
        });

        expect(checkIns).toHaveLength(2)
        expect(checkIns).toEqual([
            expect.objectContaining({ gymId: "gym-1" }),
            expect.objectContaining({ gymId: "gym-2" }),
        ])
    });
    
    it("should be able to fetch paginated check-ins history", async () => {
        for (let i = 1; i <= 22; i++) {
            await checkInsRepository.create({
                gymId: `gym-${i}`,
                userId: "user-1",
            })
        }

        const { checkIns } = await sut.execute({
            userId: "user-1",
            page: 2,
        });

        expect(checkIns).toHaveLength(2)
        expect(checkIns).toEqual([
            expect.objectContaining({ gymId: "gym-21" }),
            expect.objectContaining({ gymId: "gym-22" }),
        ])
    });
});