import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
    imports: [
        AuthModule,
        UserModule,
        PrismaModule,
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            imports: [AuthModule],
            inject: [JwtService],
            useFactory: (jwtService: JwtService) => ({
                autoSchemaFile: true,
                sortSchema: true,
                context: ({ req, res }: { req: any; res: any }) => {
                    const token = req.cookies?.token;
                    if (token) {
                        try {
                            const decoded = jwtService.verify(token, {
                                secret: process.env.JWT_SECRET,
                            });
                            req.userId = decoded.sub;
                        } catch {
                            // nieważny token
                            console.error('Invalid JWT token');
                        }
                    }
                    return { req, res };
                },
            }),
        }),
    ],
})
export class AppModule {}
