import type { Prisma } from "@/generated/prisma/browser.js";
import type { Gym } from "@prisma/client";

export interface FindManyNearbyGymsParams {
    latitude: number;
    longitude: number;
}
export interface GymsRepository {
    findById(id: string): Promise<Gym | null>
    findManyNearby(params: FindManyNearbyGymsParams): Promise<Gym[]>
    create(data: Prisma.GymCreateInput): Promise<Gym>
    searchMany(query: string, page: number): Promise<Gym[]>
}