import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1709542940498 implements MigrationInterface {
  name = 'NewMigrations1709542940498';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`quotes\` CHANGE \`status\` \`status\` tinyint NOT NULL COMMENT '0: Inactive, 1: Active' DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`quotes\` CHANGE \`status\` \`status\` tinyint NOT NULL COMMENT '0: Inactive, 1: Active' DEFAULT '0'`,
    );
  }
}
