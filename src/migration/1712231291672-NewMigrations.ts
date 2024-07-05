import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1712231291672 implements MigrationInterface {
  name = 'NewMigrations1712231291672';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`zoom_call_meetings\` ADD \`chat_message_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`group_message\` CHANGE \`message_type\` \`message_type\` enum ('text', 'image', 'audio', 'video', 'meeting') NOT NULL DEFAULT 'text'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat_messages\` CHANGE \`message_type\` \`message_type\` enum ('text', 'image', 'audio', 'video', 'meeting') NOT NULL DEFAULT 'text'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`zoom_call_meetings\` ADD CONSTRAINT \`FK_1073b06137963ad3b629f85f02a\` FOREIGN KEY (\`chat_message_id\`) REFERENCES \`chat_messages\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`zoom_call_meetings\` DROP FOREIGN KEY \`FK_1073b06137963ad3b629f85f02a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat_messages\` CHANGE \`message_type\` \`message_type\` enum ('text', 'image', 'audio', 'video') NOT NULL DEFAULT 'text'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`group_message\` CHANGE \`message_type\` \`message_type\` enum ('text', 'image', 'audio', 'video') NOT NULL DEFAULT 'text'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`zoom_call_meetings\` DROP COLUMN \`chat_message_id\``,
    );
  }
}
