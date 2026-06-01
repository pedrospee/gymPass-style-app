import { expect, describe, it, beforeEach }  from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository.js";
import { CreateGymUseCase } from "@/use-cases/create-gym.js";


let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Create Gym Use Case", () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository()
        sut = new CreateGymUseCase(gymsRepository)
    })
    it("should be able to create a gym", async () => {
        // Test implementation
        const { gym } = await sut.execute({
            title: "Gym Name",
            description: "Gym Description",
            phone: "123456789",
            latitude: -23.5344425,
            longitude: -46.6222736,
        });

        expect(gym.id).toEqual(expect.any(String))
    });
});