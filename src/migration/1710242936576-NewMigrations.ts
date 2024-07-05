import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1710242936576 implements MigrationInterface {
  name = 'NewMigrations1710242936576';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD \`payment_status\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`orders\` DROP COLUMN \`payment_status\``,
    );
  }
}
