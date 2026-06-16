import { expect, describe, it, beforeEach, afterEach, vi }  from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository.js";
import { ValidateCheckInUseCase } from "./validate-check-in.js";



let checkInsRepository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;

describe("Validate Check-in Use Case", () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new ValidateCheckInUseCase(checkInsRepository)

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it("should be able to validate a check-in", async () => {
        const createdCheckIn = await checkInsRepository.create({
            gymId: "gym-01",
            userId: "user-01",
        });
        
        const { checkIn } = await sut.execute({
            checkInId: createdCheckIn.id,
        })

        expect(checkIn.validated_at).toEqual(expect.any(Date))
        expect(checkInsRepository.items[0]?.validated_at).toEqual(expect.any(Date))
    });

    it("shouldn't be able to validate a non-existent check-in", async () => {
        await expect(() => sut.execute({
            checkInId: "inexistent-check-in-id",
        })).rejects.toBeInstanceOf(Error)
    });

    it("shouldn't be able to validate a check-in after 20 minutes of its creation", async () => {
        vi.setSystemTime(new Date(2023, 0, 1, 13, 40)) // 1 Jan 2023, 13:40

        const createdCheckIn = await checkInsRepository.create({
            gymId: "gym-01",
            userId: "user-01",
        });

        const twentyOneMinutesInMs = 1000 * 60 * 21

        vi.advanceTimersByTime(twentyOneMinutesInMs)

        await expect(() => 
            sut.execute({
                checkInId: createdCheckIn.id,
            }),
        ).rejects.toBeInstanceOf(Error)
    });
});