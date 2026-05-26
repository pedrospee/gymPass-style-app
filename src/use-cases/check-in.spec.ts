import { expect, describe, it, beforeEach, afterEach, vi}  from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository.js";
import { CheckInUseCase } from "./check-in.js";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository.js";
import { Decimal } from "@prisma/client/runtime/client";


let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check-in Use Case", () => {
    beforeEach(async () => {
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository = new InMemoryGymsRepository()
        sut = new CheckInUseCase(checkInsRepository, gymsRepository)

        gymsRepository.items.push({
            id: "gym-1",
            title: "JavaScript Gym",
            description: "",
            phone: "",
            latitude: new Decimal(-23.5344425),
            longitude: new Decimal(-46.6222736),
        })

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it("should be able to check in", async () => {
        const { checkIn } = await sut.execute({
            userId: "user-1",
            gymId: "gym-1",
            userLatitude: -23.5344425,
            userLongitude: -46.6222736,
        });

        expect(checkIn.id).toEqual(expect.any(String))
    });

    it("shouldn't be able to check in twice in the same day", async () => {
        // Test implementation
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        await sut.execute({
            userId: "user-1",
            gymId: "gym-1",
            userLatitude: -23.5344425,
            userLongitude: -46.6222736,
        });

        await expect(() => 
            sut.execute({
                userId: "user-1",
                gymId: "gym-1",
                userLatitude: -23.5344425,
                userLongitude: -46.6222736,
            }),
        ).rejects.toBeInstanceOf(Error)
    });
    it("should be able to check in twice in different days", async () => {
        // Test implementation
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        await sut.execute({
            userId: "user-1",
            gymId: "gym-1",
            userLatitude: -23.5344425,
            userLongitude: -46.6222736,
        });

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

        const { checkIn } = await sut.execute({
            userId: "user-1",
            gymId: "gym-1",
            userLatitude: -23.5344425,
            userLongitude: -46.6222736,
        });

        expect(checkIn.id).toEqual(expect.any(String))
    });

    it("shouldn't be able to check in on distant gym", async () => {
        gymsRepository.items.push({
            id: "gym-2",
            title: "JavaScript Gym",
            description: "",
            phone: "",
            latitude: new Decimal(-23.4996825),
            longitude: new Decimal(-46.6344009),
        })

        await expect(() =>
            sut.execute({
                userId: "user-1",
            gymId: "gym-2",
            userLatitude: -23.5344425,
            userLongitude: -46.6222736,
            }),
        ).rejects.toBeInstanceOf(Error)
    });
});