import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1710327107823 implements MigrationInterface {
  name = 'NewMigrations1710327107823';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`orders\` CHANGE \`payment_status\` \`payment_status\` enum ('processing', 'canceled', 'succeeded') NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`orders\` CHANGE \`payment_status\` \`payment_status\` enum ('processing', 'cancelled', 'succeeded') NULL`,
    );
  }
}
