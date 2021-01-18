import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateTransactionEntity1610552383053
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.createTable(
      new Table({
        name: 'TRANSACTION',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: false,
            enum: ['income', 'outcome'],
          },
          {
            name: 'value',
            type: 'decimal',
            scale: 2,
          },
          {
            name: 'category_id',
            isNullable: false,
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('TRANSACTION', true);
  }
}