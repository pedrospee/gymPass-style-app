import type { CheckIn } from "@/generated/prisma/client.js";
import type { CheckInsRepository } from "@/repositories/check-ins-repository.js";
import { ResourceNotFoundError } from "./errors/resource-not-found-error.js";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error.js";
import dayjs from "dayjs";




interface ValidateCheckInUseCaseRequest {
    checkInId: string;
}
interface ValidateCheckInUseCaseResponse {
    checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
    constructor(private checkInsRepository: CheckInsRepository) {}

    async execute({ 
        checkInId,
    }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
        const checkIn = await this.checkInsRepository.findById(checkInId)

        if (!checkIn) {
            throw new ResourceNotFoundError()
        }

        const distanceInMinutesFromCreation = dayjs(new Date()).diff(
            checkIn.createdAt, 
            "minutes",
        )
        if (distanceInMinutesFromCreation > 20) {
            throw new LateCheckInValidationError()
        }
        checkIn.validated_at = new Date()

        await this.checkInsRepository.save(checkIn)

        return {
            checkIn,
        }
    }
}