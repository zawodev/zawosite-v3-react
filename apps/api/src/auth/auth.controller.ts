import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service.js';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    @Get('discord')
    redirectToDiscord(@Res() res: Response) {
        const clientId = process.env.DISCORD_CLIENT_ID;
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

        if (!clientId || !backendUrl) {
            throw new Error(
                '[Auth Error] DISCORD_CLIENT_ID and NEXT_PUBLIC_BACKEND_URL are required in .env!',
            );
        }

        const redirectUri = encodeURIComponent(`${backendUrl}/auth/discord/callback`);
        const scope = encodeURIComponent('identify email');

        const discordUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scope}`;
        return res.redirect(discordUrl);
    }

    @Get('discord/callback')
    async handleDiscordCallback(@Query('code') code: string, @Res() res: Response) {
        const frontendUrl = process.env.FRONTEND_URL;
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        const clientId = process.env.DISCORD_CLIENT_ID;
        const clientSecret = process.env.DISCORD_CLIENT_SECRET;

        if (!frontendUrl || !backendUrl || !clientId || !clientSecret) {
            throw new Error('[Auth Error] Missing required auth env vars in .env!');
        }

        if (!code) {
            return res.redirect(`${frontendUrl}?error=missing_code`);
        }

        try {
            // 1. Wymiana code na access_token
            const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    client_id: clientId,
                    client_secret: clientSecret,
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: `${backendUrl}/auth/discord/callback`,
                }),
            });

            const tokenData = await tokenResponse.json();
            if (!tokenResponse.ok) {
                throw new Error(tokenData.error_description || 'Failed to fetch Discord token');
            }

            // 2. Pobranie danych profilu usera z Discorda
            const userResponse = await fetch('https://discord.com/api/users/@me', {
                headers: { Authorization: `Bearer ${tokenData.access_token}` },
            });
            const discordUser = await userResponse.json();

            // 3. Upsert do naszej bazy danych
            const user = await this.userService.upsertFromDiscord(discordUser);
            if (!user) {
                throw new Error('Failed to upsert Discord user');
            }

            // 4. Wygenerowanie JWT i zapis w ciasteczku httpOnly
            const jwtToken = this.jwtService.sign({ sub: user.id });

            res.cookie('token', jwtToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dni
            });

            return res.redirect(frontendUrl);
        } catch (err) {
            console.error('Discord Auth Error:', err);
            return res.redirect(`${frontendUrl}?error=oauth_failed`);
        }
    }

    @Get('logout')
    logout(@Res() res: Response) {
        const frontendUrl = process.env.FRONTEND_URL;
        if (!frontendUrl) {
            throw new Error('[Auth Error] FRONTEND_URL is required in .env!');
        }
        res.clearCookie('token');
        return res.redirect(frontendUrl);
    }
}
