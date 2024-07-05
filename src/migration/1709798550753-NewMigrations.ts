import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1709798550753 implements MigrationInterface {
  name = 'NewMigrations1709798550753';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`events\` ADD \`status\` tinyint NOT NULL COMMENT '0: Inactive, 1: Active' DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`events\` DROP COLUMN \`status\``);
  }
}
