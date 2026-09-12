import path from 'node:path';
import fs from 'node:fs';

// Load .env from current directory or workspace root
for (const dir of [
    process.cwd(),
    path.resolve(process.cwd(), '..'),
    path.resolve(process.cwd(), '../..'),
]) {
    const envPath = path.join(dir, '.env');
    if (fs.existsSync(envPath)) {
        process.loadEnvFile(envPath);
        break;
    }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    agentRules: false,
    env: {
        NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    },
};

export default nextConfig;
