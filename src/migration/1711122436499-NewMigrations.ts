import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1711122436499 implements MigrationInterface {
  name = 'NewMigrations1711122436499';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_plans\` DROP COLUMN \`pdf_url\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_plans\` ADD \`pdf_url\` longtext NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_plans\` DROP COLUMN \`pdf_url\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_plans\` ADD \`pdf_url\` varchar(255) NULL`,
    );
  }
}
