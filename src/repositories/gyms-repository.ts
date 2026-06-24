import type { Prisma, Gym } from '@/generated/prisma/client.js';

export interface FindManyNearbyGymsParams {
    latitude: number;
    longitude: number;
}
export interface GymsRepository {
    findById(id: string): Promise<Gym | null>;
    findManyNearby(params: FindManyNearbyGymsParams): Promise<Gym[]>;
    create(data: Prisma.GymCreateInput): Promise<Gym>;
    searchMany(query: string, page: number): Promise<Gym[]>;
}
