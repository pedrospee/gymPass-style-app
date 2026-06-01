import type { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import type { CheckInsRepository } from "../check-ins-repository.js";
import { randomUUID } from "node:crypto";
import type { CheckIn } from "@/generated/prisma/browser.js";


export class InMemoryCheckInsRepository implements CheckInsRepository {
    public items: CheckIn[] = []

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

}