import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707811316738 implements MigrationInterface {
  name = 'NewMigrations1707811316738';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`cms_page\` ADD \`status\` tinyint NOT NULL COMMENT '0: Inactive, 1: Active' DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`cms_page\` DROP COLUMN \`status\``);
  }
}
