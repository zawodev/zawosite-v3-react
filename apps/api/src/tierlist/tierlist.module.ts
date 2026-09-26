import { Module } from '@nestjs/common';
import { TierlistResolver } from './tierlist.resolver.js';
import { TierlistService } from './tierlist.service.js';
import { UserModule } from '../user/user.module.js';

@Module({
    imports: [UserModule],
    providers: [TierlistResolver, TierlistService],
})
export class TierlistModule {}
