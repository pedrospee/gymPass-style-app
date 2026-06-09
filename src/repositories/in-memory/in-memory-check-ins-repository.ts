import type { Prisma, CheckIn } from "@/generated/prisma/client.js";
import dayjs from "dayjs";
import { randomUUID } from "crypto";
import type { CheckInsRepository } from "@/repositories/check-ins-repository.js";


export class InMemoryCheckInsRepository implements CheckInsRepository {
    public items: CheckIn[] = []

    async findById(id: string) {
        const checkIn = this.items.find((item) => item.id === id)

        if (!checkIn) {
            return null
        }

        return checkIn
    }

    async findByUserIdOnDate(userId: string, date: Date) {
        const startOfTheDay = dayjs(date).startOf("date")
        const endOfTheDay = dayjs(date).endOf("date")
        const checkInOnSameDate = this.items.find((checkIn) => {
            const checkInDate = dayjs (checkIn.createdAt)

            const isOnSameDate =
                checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

            return checkIn.userId === userId && isOnSameDate
        })

        return checkInOnSameDate ?? null
    }

    async findManyByUserId(userId: string, page: number) {
        const startIndex = (page - 1) * 20
        const endIndex = startIndex + 20
        return this.items.filter((item) => item.userId === userId).slice(startIndex, endIndex)
    }

    async countByUserId(userId: string) {
        return this.items.filter((item) => item.userId === userId).length
    }

        async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn = {
            id: randomUUID(),
            userId: data.userId,
            gymId: data.gymId,
            validated_at: data.validated_at ? new Date(data.validated_at) : null,
            createdAt: new Date(),
        }

        this.items.push(checkIn)
        return checkIn;
    }

    async save(checkIn: CheckIn) {
        const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id)

        if (checkInIndex >= 0) {
            this.items[checkInIndex] = checkIn
        }

        return checkIn
    }

}