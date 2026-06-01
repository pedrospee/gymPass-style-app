import type { Gym } from "@prisma/client";
import { Prisma } from "@/generated/prisma/browser.js";
import type { GymsRepository } from "../gyms-repository.js";
import { randomUUID } from "node:crypto";


export class InMemoryGymsRepository implements GymsRepository {
    public items: Gym[] = []

    async findById(id: string): Promise<Gym | null> {
        const gym = this.items.find((item) => item.id === id)

        if (!gym) {
            return null
        }

        return gym
    }

    async searchMany(query: string, page: number): Promise<Gym[]> {
            const startIndex = (page - 1) * 20
            const endIndex = startIndex + 20
            return this.items.filter((item) => item.title.includes(query))
            .slice(startIndex, endIndex)
    }

    async create(data: Prisma.GymCreateInput) {
        const gym = {
            id: data.id ?? randomUUID(),
            title: data.title,
            description: data.description ?? null,
            phone: data.phone ?? null,
            latitude: new Prisma.Decimal(data.latitude.toString()),
            longitude: new Prisma.Decimal(data.longitude.toString()),
            created_at: new Date(),
        }
        this.items.push(gym)

        return gym
    }
}