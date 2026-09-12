import { Injectable, OnModuleInit } from '@nestjs/common';
import { db } from '@repo/database';

@Injectable()
export class PrismaService implements OnModuleInit {
  readonly client = db;

  async onModuleInit() {
    // Prisma 8 uses node-pg connection pool managed automatically.
    // No explicit connect/disconnect needed — pool initializes on first query.
  }
}

