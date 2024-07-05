import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707306690057 implements MigrationInterface {
  name = 'NewMigrations1707306690057';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`ChatMessages\` CHANGE \`message_type\` \`message_type\` enum ('text', 'image', 'audio', 'video') NOT NULL DEFAULT 'text'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`ChatMessages\` CHANGE \`message_type\` \`message_type\` enum ('text', 'json', 'image', 'voice') NOT NULL DEFAULT 'text'`,
    );
  }
}
