#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/73b61691a1e2471331a8a24fd23fe7db9561761209e8077c4babad7f83f3fbd1/contract';
import endContract from '../../snapshots/73b61691a1e2471331a8a24fd23fe7db9561761209e8077c4babad7f83f3fbd1/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/fed2db977606d237dbf6f37531c60be4e7046f877e73f32555595cab7544b285/contract';
import startContract from '../../snapshots/fed2db977606d237dbf6f37531c60be4e7046f877e73f32555595cab7544b285/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'Tierlist',
        columns: [
          col('entries', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'SERIAL', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamp(3)', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamp-temporal@1', typeParams: { precision: 3 } },
          }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addColumn({
        schema: 'public',
        table: 'User',
        column: col('role', 'text', {
          notNull: true,
          default: lit('DEFAULT'),
          codecRef: { codecId: 'pg/text@1' },
        }),
      }),
      this.addUnique({
        schema: 'public',
        table: 'Tierlist',
        constraint: 'Tierlist_userId_key',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'Tierlist',
        foreignKey: {
          name: 'Tierlist_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
