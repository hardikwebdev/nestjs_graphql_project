import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1706097978428 implements MigrationInterface {
  name = 'NewMigrations1706097978428';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`is_verified\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`role\` \`role\` tinyint NULL COMMENT '0: Super admin, 1: parent, 2 : Teacher, 3: staff' DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`status\` \`status\` tinyint NOT NULL COMMENT '0: Inactive or Disable, 1: Active or Enable, 2: Invitation Accept Pending, 3: Users verification pending' DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Products\` CHANGE \`status\` \`status\` tinyint NOT NULL COMMENT '0: Active, 1: Inactive' DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Products\` CHANGE \`status\` \`status\` tinyint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`status\` \`status\` tinyint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`role\` \`role\` tinyint NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`is_verified\` tinyint NOT NULL DEFAULT '0'`,
    );
  }
}
