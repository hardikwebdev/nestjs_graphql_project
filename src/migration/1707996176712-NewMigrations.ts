import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707996176712 implements MigrationInterface {
  name = 'NewMigrations1707996176712';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`ChatMessages\``);
    await queryRunner.query(`DROP TABLE \`ChatRooms\``);
    await queryRunner.query(
      `CREATE TABLE \`chat_rooms\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`room\` varchar(255) NOT NULL, \`school_id\` int NULL, UNIQUE INDEX \`IDX_79fb46a4c2e5bbeaeb0f3b0054\` (\`school_id\`), UNIQUE INDEX \`REL_79fb46a4c2e5bbeaeb0f3b0054\` (\`school_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`chat_messages\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`message\` longtext NOT NULL, \`message_type\` enum ('text', 'image', 'audio', 'video') NOT NULL DEFAULT 'text', \`sender_id\` int NOT NULL, \`receiver_id\` int NOT NULL, \`student_id\` int NOT NULL, \`chat_room_id\` int NOT NULL, \`is_read\` tinyint NOT NULL COMMENT '1: read, 0: unread' DEFAULT '0', \`is_sent\` tinyint NOT NULL COMMENT '1: sent, 0: unsent' DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat_rooms\` ADD CONSTRAINT \`FK_79fb46a4c2e5bbeaeb0f3b00540\` FOREIGN KEY (\`school_id\`) REFERENCES \`Schools\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat_messages\` ADD CONSTRAINT \`FK_9e5fc47ecb06d4d7b84633b1718\` FOREIGN KEY (\`sender_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat_messages\` ADD CONSTRAINT \`FK_c1787d1874556cb9eb0483a7e2b\` FOREIGN KEY (\`receiver_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat_messages\` ADD CONSTRAINT \`FK_3217ec6230770d4d2c826fc0380\` FOREIGN KEY (\`chat_room_id\`) REFERENCES \`chat_rooms\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat_messages\` ADD CONSTRAINT \`FK_37768c3bb7b6ec10516d9789662\` FOREIGN KEY (\`student_id\`) REFERENCES \`Students\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`chat_messages\` DROP FOREIGN KEY \`FK_37768c3bb7b6ec10516d9789662\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat_messages\` DROP FOREIGN KEY \`FK_3217ec6230770d4d2c826fc0380\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat_messages\` DROP FOREIGN KEY \`FK_c1787d1874556cb9eb0483a7e2b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat_messages\` DROP FOREIGN KEY \`FK_9e5fc47ecb06d4d7b84633b1718\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`chat_rooms\` DROP FOREIGN KEY \`FK_79fb46a4c2e5bbeaeb0f3b00540\``,
    );
    await queryRunner.query(`DROP TABLE \`chat_messages\``);
    await queryRunner.query(
      `DROP INDEX \`REL_79fb46a4c2e5bbeaeb0f3b0054\` ON \`chat_rooms\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_79fb46a4c2e5bbeaeb0f3b0054\` ON \`chat_rooms\``,
    );
    await queryRunner.query(`DROP TABLE \`chat_rooms\``);
    await queryRunner.query(
      `CREATE TABLE \`ChatRooms\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`room\` varchar(255) NOT NULL, \`school_id\` int NULL, UNIQUE INDEX \`IDX_a7577edee27d089bf8aa078ec9\` (\`school_id\`), UNIQUE INDEX \`REL_a7577edee27d089bf8aa078ec9\` (\`school_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`ChatMessages\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`message\` longtext NOT NULL, \`message_type\` enum ('text', 'image', 'audio', 'video') NOT NULL DEFAULT 'text', \`sender_id\` int NOT NULL, \`receiver_id\` int NOT NULL, \`student_id\` int NOT NULL, \`chat_room_id\` int NOT NULL, \`is_read\` tinyint NOT NULL COMMENT '1: read, 0: unread' DEFAULT '0', \`is_sent\` tinyint NOT NULL COMMENT '1: sent, 0: unsent' DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ChatRooms\` ADD CONSTRAINT \`FK_a7577edee27d089bf8aa078ec97\` FOREIGN KEY (\`school_id\`) REFERENCES \`Schools\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ChatMessages\` ADD CONSTRAINT \`FK_045a81b30c7f0284df51f7b7d32\` FOREIGN KEY (\`sender_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ChatMessages\` ADD CONSTRAINT \`FK_e1a560835c7699703879399fdc9\` FOREIGN KEY (\`receiver_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ChatMessages\` ADD CONSTRAINT \`FK_e3553402bb734e9a0ddda95a913\` FOREIGN KEY (\`chat_room_id\`) REFERENCES \`ChatRooms\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ChatMessages\` ADD CONSTRAINT \`FK_34c4a9d9100531d4d368340609b\` FOREIGN KEY (\`student_id\`) REFERENCES \`Students\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
