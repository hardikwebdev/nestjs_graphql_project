import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1710333489497 implements MigrationInterface {
  name = 'NewMigrations1710333489497';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`classes\` ADD \`status\` tinyint NOT NULL COMMENT '0: Inactive, 1: Active' DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`classes\` DROP COLUMN \`status\``);
  }
}
