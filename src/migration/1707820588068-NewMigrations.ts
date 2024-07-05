import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707820588068 implements MigrationInterface {
  name = 'NewMigrations1707820588068';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`cms_page\` CHANGE \`status\` \`status\` tinyint NOT NULL COMMENT '0: Inactive, 1: Active' DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`cms_page\` CHANGE \`status\` \`status\` tinyint NOT NULL COMMENT '0: Inactive, 1: Active' DEFAULT '0'`,
    );
  }
}
