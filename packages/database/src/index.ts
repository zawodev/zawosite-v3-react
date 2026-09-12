import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';

// Load .env from current working directory or workspace root
for (const dir of [
    process.cwd(),
    path.resolve(process.cwd(), '..'),
    path.resolve(process.cwd(), '../..'),
]) {
    const envPath = path.join(dir, '.env');
    if (fs.existsSync(envPath)) {
        dotenv.config({ path: envPath });
        break;
    }
}

import { Temporal } from '@js-temporal/polyfill';

if (!('Temporal' in globalThis)) {
    Object.defineProperty(globalThis, 'Temporal', {
        value: Temporal,
        configurable: true,
        writable: true,
    });
}

export function getDatabaseUrl(): string {
    const user = process.env.POSTGRES_USER;
    const pass = process.env.POSTGRES_PASSWORD;
    const host = process.env.POSTGRES_HOST;
    const port = process.env.POSTGRES_PORT;
    const db = process.env.POSTGRES_DB;

    const missing: string[] = [];
    if (!user) missing.push('POSTGRES_USER');
    if (!pass) missing.push('POSTGRES_PASSWORD');
    if (!host) missing.push('POSTGRES_HOST');
    if (!port) missing.push('POSTGRES_PORT');
    if (!db) missing.push('POSTGRES_DB');

    if (missing.length > 0) {
        throw new Error(
            `[Database Error] Missing required environment variables: ${missing.join(
                ', ',
            )}. Check your .env file!`,
        );
    }

    return `postgresql://${user}:${pass}@${host}:${port}/${db}?schema=public`;
}

import postgres from '@prisma/orm-postgres/runtime';
import type { DefaultModelRow } from '@prisma/orm-postgres/orm-client';
import type { Contract } from '../generated/prisma8/contract.js';
import contractJson from '../generated/prisma8/contract.json' with { type: 'json' };

const globalForDb = globalThis as unknown as {
    db: ReturnType<typeof postgres<Contract>> | undefined;
};

export const db =
    globalForDb.db ??
    postgres<Contract>({
        url: getDatabaseUrl(),
        contractJson,
    });

if (
    (
        globalThis as typeof globalThis & {
            process?: { env?: { NODE_ENV?: string } };
        }
    ).process?.env?.NODE_ENV !== 'production'
) {
    globalForDb.db = db;
}

export type { Contract } from '../generated/prisma8/contract.js';
export type User = DefaultModelRow<Contract, 'User', 'public'>;
