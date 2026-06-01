import type { Gym } from "@/generated/prisma/browser.js";
import type { GymsRepository } from "@/repositories/gyms-repository.js";


interface CreateGymUseCaseRequest {
    title: string;
    description?: string;
    phone: string | null;
    latitude: number;
    longitude: number;
}
interface CreateGymUseCaseResponse {
    gym: Gym;
}
export class CreateGymUseCase {
    constructor(private gymsRepository: GymsRepository) {}


    async execute({
        title,
        description,
        phone,
        latitude,
        longitude,
    }: CreateGymUseCaseRequest) {
        const gym = await this.gymsRepository.create({
            title,
            description: description ?? null,
            phone,
            latitude,
            longitude,
        })
        return { gym }
    }
}