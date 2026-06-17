import type { CheckInsRepository } from '../check-ins-repository.js';
import { prisma } from '@/lib/prisma.js';
import type { Prisma, CheckIn } from '@/generated/prisma/client.js';
import dayjs from 'dayjs';

export class PrismaCheckInsRepository implements CheckInsRepository {
    async findById(id: string) {
        const checkIn = await prisma.checkIn.findUnique({ where: { id } })
        return checkIn
    }

    async findByUserIdOnDate(userId: string, date: Date) {
        const startOfDay = dayjs(date).startOf('day');
        const endOfDay = dayjs(date).endOf('day');

        const checkIn = await prisma.checkIn.findFirst({
            where: {
                userId,
                created_at: {
                    gte: startOfDay.toDate(),
                    lte: endOfDay.toDate(),
                },
            },
        });

        return checkIn;
    }

    async findManyByUserId(userId: string, page: number) {
        const checkIns = await prisma.checkIn.findMany({
            where: {
                userId,
            },
            take: 20,
            skip: (page - 1) * 20,
        })
        return checkIns
    }

    async countByUserId(userId: string) {
        const count = await prisma.checkIn.count({
            where: {
                userId,
            }
        })
        return count
    }

    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn = await prisma.checkIn.create({
            data,
        })
        return checkIn
    }

    async save(data: CheckIn) {
        const checkIn = await prisma.checkIn.update({
            where: { id: data.id },
            data: data,
        })
        return checkIn
    }

}