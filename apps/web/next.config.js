import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
/*TODO: kurwa przejrzeć ten kod bo to slop ale mi sie teraz nie chce tego sprawdzac*/
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

// Read app version from the workspace root, regardless of the command's cwd.
// `pnpm version patch/minor/major` in root updates this automatically.
const workspaceRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../..',
);
const rootPackage = JSON.parse(
    fs.readFileSync(path.join(workspaceRoot, 'package.json'), 'utf-8'),
);
const appVersion = rootPackage.version ?? '0.0.0';

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    agentRules: false,
    env: {
        NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
        NEXT_PUBLIC_APP_VERSION: appVersion,
    },
};

export default nextConfig;
