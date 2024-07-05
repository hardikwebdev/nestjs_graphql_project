import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1709892225464 implements MigrationInterface {
  name = 'NewMigrations1709892225464';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`chat_rooms\` ADD \`room_users\` longtext NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`chat_rooms\` DROP COLUMN \`room_users\``,
    );
  }
}
