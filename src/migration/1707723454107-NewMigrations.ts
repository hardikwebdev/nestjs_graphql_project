import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707723454107 implements MigrationInterface {
  name = 'NewMigrations1707723454107';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Students\` ADD \`allergy_description\` TEXT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Students\` DROP COLUMN \`allergy_description\``,
    );
  }
}
