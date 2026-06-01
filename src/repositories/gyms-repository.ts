import type { Prisma } from "@/generated/prisma/browser.js";
import type { Gym } from "@prisma/client";

export interface GymsRepository {
    findById(id: string): Promise<Gym | null>
    create(data: Prisma.GymCreateInput): Promise<Gym>
}