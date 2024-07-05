import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1712233103783 implements MigrationInterface {
  name = 'NewMigrations1712233103783';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`chat_messages\` ADD \`is_approved\` tinyint NOT NULL COMMENT '0: pending, 1: approved, 2: rejected' DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`chat_messages\` DROP COLUMN \`is_approved\``,
    );
  }
}
