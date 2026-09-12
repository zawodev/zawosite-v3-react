import { definePrismaConfig } from 'prisma/config';
import { defineConfig as definePostgresConfig } from '@prisma/orm-postgres/config';
import { getDatabaseUrl } from './src/index.js';

const isDbConfigured = Boolean(
    process.env.POSTGRES_USER &&
    process.env.POSTGRES_PASSWORD &&
    process.env.POSTGRES_HOST &&
    process.env.POSTGRES_PORT &&
    process.env.POSTGRES_DB,
);

export default definePrismaConfig({
    orm: definePostgresConfig({
        contract: 'prisma/contract.prisma',
        output: 'generated/prisma8',
        ...(isDbConfigured ? { db: { connection: getDatabaseUrl() } } : {}),
    }),
});
