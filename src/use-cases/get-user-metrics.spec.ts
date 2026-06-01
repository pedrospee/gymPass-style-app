import { expect, describe, it, beforeEach, afterEach, vi}  from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository.js";
import { GetUserMetricsUseCase } from "./get-user-metrics.js";


let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;

describe("Fetch User Check-ins History Use Case", () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new GetUserMetricsUseCase(checkInsRepository)

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it("should be able to get check-ins count from metrics", async () => {
        await checkInsRepository.create({
            gymId: "gym-1",
            userId: "user-1",
        })

        await checkInsRepository.create({
            gymId: "gym-2",
            userId: "user-1",
        })

        const { checkInsCount } = await sut.execute({
            userId: "user-1",
        });

        expect(checkInsCount).toEqual(2)
    });
})