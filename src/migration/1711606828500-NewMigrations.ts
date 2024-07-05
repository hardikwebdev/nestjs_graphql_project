import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1711606828500 implements MigrationInterface {
  name = 'NewMigrations1711606828500';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_recent_logs\` CHANGE \`status\` \`status\` tinyint NOT NULL COMMENT 'This status represent to sick and time_off request' DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_recent_logs\` CHANGE \`status\` \`status\` tinyint NULL COMMENT 'This status represent to sick and time_off request'`,
    );
  }
}
