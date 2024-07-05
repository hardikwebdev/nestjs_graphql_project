import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1708075475513 implements MigrationInterface {
  name = 'NewMigrations1708075475513';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`group_message_receivers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`receiver_id\` int NOT NULL, \`group_message_id\` int NOT NULL, \`is_read\` tinyint NOT NULL COMMENT '1: read, 0: unread' DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`group_message\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`sender_id\` int NOT NULL, \`chat_room_id\` int NOT NULL, \`message\` longtext NOT NULL, \`message_type\` enum ('text', 'image', 'audio', 'video') NOT NULL DEFAULT 'text', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`group_message_receivers\` ADD CONSTRAINT \`FK_b563f361fee988dbd6acccbe1f9\` FOREIGN KEY (\`receiver_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`group_message_receivers\` ADD CONSTRAINT \`FK_58ad5b65836821f790d46d294fa\` FOREIGN KEY (\`group_message_id\`) REFERENCES \`group_message\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`group_message\` ADD CONSTRAINT \`FK_6af63414f8a436e35448930e662\` FOREIGN KEY (\`sender_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`group_message\` ADD CONSTRAINT \`FK_905914e60023a0a5b9f5d945bd0\` FOREIGN KEY (\`chat_room_id\`) REFERENCES \`chat_rooms\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`group_message\` DROP FOREIGN KEY \`FK_905914e60023a0a5b9f5d945bd0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`group_message\` DROP FOREIGN KEY \`FK_6af63414f8a436e35448930e662\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`group_message_receivers\` DROP FOREIGN KEY \`FK_58ad5b65836821f790d46d294fa\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`group_message_receivers\` DROP FOREIGN KEY \`FK_b563f361fee988dbd6acccbe1f9\``,
    );
    await queryRunner.query(`DROP TABLE \`group_message\``);
    await queryRunner.query(`DROP TABLE \`group_message_receivers\``);
  }
}
