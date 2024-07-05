import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1708346057740 implements MigrationInterface {
  name = 'NewMigrations1708346057740';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`group_message_receivers\` ADD \`chat_room_id\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`group_message_receivers\` ADD CONSTRAINT \`FK_c62f5fa709b7ee03078347dfbf6\` FOREIGN KEY (\`chat_room_id\`) REFERENCES \`chat_rooms\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`group_message_receivers\` DROP FOREIGN KEY \`FK_c62f5fa709b7ee03078347dfbf6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`group_message_receivers\` DROP COLUMN \`chat_room_id\``,
    );
  }
}
