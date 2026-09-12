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

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());

    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
        throw new Error('[API Config Error] FRONTEND_URL is required in .env!');
    }

    app.enableCors({
        origin: [frontendUrl],
        credentials: true,
    });

    const port = process.env.PORT ?? 4000;
    await app.listen(port);

    console.log(`🚀 zawosite's API Server running on http://localhost:${port}`);
}

await bootstrap();
