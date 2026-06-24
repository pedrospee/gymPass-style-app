import 'dotenv/config';
import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import type { Environment } from 'vitest/environments';
import { Client } from 'pg';

function getPrismaDatabaseUrl(schema: string) {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is not defined');
    }

    const url = new URL(process.env.DATABASE_URL);
    url.searchParams.set('schema', schema);

    return url.toString();
}

export default <Environment>{
  name: 'prisma-test-environment',
  transformMode: 'ssr',
    async setup() {
        const schema = randomUUID();
        const databaseUrl = getPrismaDatabaseUrl(schema);

        process.env.DATABASE_URL = databaseUrl;

        execSync('npx prisma migrate deploy', { stdio: 'inherit' });

        return {
            async teardown() {
                const client = new Client({ connectionString: databaseUrl });
                await client.connect();
                await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
                await client.end();
            },
        };
    },
};
