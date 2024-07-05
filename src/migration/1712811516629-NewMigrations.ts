import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1712811516629 implements MigrationInterface {
  name = 'NewMigrations1712811516629';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`exchange_return_requests\` ADD \`request_type\` enum ('exchange', 'return') NOT NULL DEFAULT 'exchange'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`exchange_return_requests\` DROP COLUMN \`request_type\``,
    );
  }
}
