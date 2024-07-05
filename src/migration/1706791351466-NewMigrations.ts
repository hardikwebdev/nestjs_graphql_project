import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1706791351466 implements MigrationInterface {
  name = 'NewMigrations1706791351466';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Schools\` ADD \`status\` tinyint NOT NULL COMMENT '0: Active, 1: Inactive, 2: Block' DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`Schools\` DROP COLUMN \`status\``);
  }
}
