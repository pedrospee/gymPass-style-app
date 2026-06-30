import { env } from '@/env/index.js';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client.js';

const connectionString = process.env.DATABASE_URL!;
const schema = new URL(connectionString).searchParams.get('schema') ?? undefined;

const pool = new Pool({
    connectionString,
    options: schema ? `-c search_path=${schema}` : undefined,
});
const adapter = new PrismaPg(pool, schema ? { schema } : undefined);

export const prisma = new PrismaClient({
    adapter,
    log: env.NODE_ENV === 'dev' ? ['query'] : []
});
