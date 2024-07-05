import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1710320849004 implements MigrationInterface {
  name = 'NewMigrations1710320849004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`orders\` DROP COLUMN \`payment_status\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD \`payment_status\` enum ('processing', 'cancelled', 'succeeded') NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`orders\` DROP COLUMN \`payment_status\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD \`payment_status\` varchar(255) NULL`,
    );
  }
}
