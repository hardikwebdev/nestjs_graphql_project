import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707978812752 implements MigrationInterface {
  name = 'NewMigrations1707978812752';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`ChatMessages\` CHANGE \`is_read\` \`is_read\` tinyint NOT NULL COMMENT '1: read, 0: unread' DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ChatMessages\` CHANGE \`is_sent\` \`is_sent\` tinyint NOT NULL COMMENT '1: sent, 0: unsent' DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`ChatMessages\` CHANGE \`is_sent\` \`is_sent\` tinyint NOT NULL COMMENT '1: unsent, 0: sent' DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ChatMessages\` CHANGE \`is_read\` \`is_read\` tinyint NOT NULL COMMENT '1: unread, 0: read' DEFAULT '0'`,
    );
  }
}
