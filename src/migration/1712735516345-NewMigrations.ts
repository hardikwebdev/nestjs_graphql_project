import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1712735516345 implements MigrationInterface {
  name = 'NewMigrations1712735516345';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`events\` ADD \`meeting_status\` tinyint NOT NULL COMMENT '0: pending, 1: approved, 2: rejected' DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`events\` ADD \`event_type\` enum ('meeting', 'event') NOT NULL DEFAULT 'event'`,
    );
    await queryRunner.query(`ALTER TABLE \`events\` ADD \`user_id\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`events\` ADD \`zoom_call_meeting_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`events\` ADD CONSTRAINT \`FK_7e3145abccd8db4232bd2d71e81\` FOREIGN KEY (\`zoom_call_meeting_id\`) REFERENCES \`zoom_call_meetings\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`events\` ADD CONSTRAINT \`FK_09f256fb7f9a05f0ed9927f406b\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_09f256fb7f9a05f0ed9927f406b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`events\` DROP FOREIGN KEY \`FK_7e3145abccd8db4232bd2d71e81\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`events\` DROP COLUMN \`zoom_call_meeting_id\``,
    );
    await queryRunner.query(`ALTER TABLE \`events\` DROP COLUMN \`user_id\``);
    await queryRunner.query(
      `ALTER TABLE \`events\` DROP COLUMN \`event_type\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`events\` DROP COLUMN \`meeting_status\``,
    );
  }
}
