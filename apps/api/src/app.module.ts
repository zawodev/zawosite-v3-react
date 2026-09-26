import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import { TierlistModule } from './tierlist/tierlist.module.js';
import { JwtService } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from './prisma/prisma.module.js';
import { JsonScalar } from './scalars/json.scalar.js';

@Module({
    imports: [
        AuthModule,
        UserModule,
        TierlistModule,
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
                            console.error('Invalid JWT token');
                        }
                    }
                    return { req, res };
                },
            }),
        }),
    ],
    providers: [JsonScalar],
})
export class AppModule {}
