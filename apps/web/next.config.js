import path from 'node:path';
import fs from 'node:fs';
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

// Read app version from root package.json (source of truth for the monorepo).
// `pnpm version patch/minor/major` in root updates this automatically.
let appVersion = '0.0.0';
for (const dir of [
    process.cwd(),
    path.resolve(process.cwd(), '..'),
    path.resolve(process.cwd(), '../..'),
]) {
    const pkgPath = path.join(dir, 'package.json');
    if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        if (pkg.version) {
            appVersion = pkg.version;
            break;
        }
    }
}

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
