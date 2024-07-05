import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1706871773488 implements MigrationInterface {
  name = 'NewMigrations1706871773488';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`ChatRooms\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`room\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`Students\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`firstname\` varchar(45) NOT NULL, \`lastname\` varchar(45) NOT NULL, \`birthdate\` date NOT NULL, \`child_care_before\` tinyint NOT NULL DEFAULT '1', \`transition_days\` tinyint NOT NULL DEFAULT '1', \`potty_trained\` tinyint NOT NULL DEFAULT '0', \`payment_type\` varchar(255) NULL, \`lunch_program\` tinyint NOT NULL DEFAULT '0', \`home_address\` varchar(255) NOT NULL, \`status\` tinyint NOT NULL DEFAULT '0', \`emergency_contact\` varchar(255) NOT NULL, \`parent_id\` int NOT NULL, \`parent_details\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`ChatMessages\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`message\` longtext NOT NULL, \`message_type\` enum ('text', 'json', 'image', 'voice') NOT NULL DEFAULT 'text', \`sender_id\` int NOT NULL, \`receiver_id\` int NOT NULL, \`student_id\` int NOT NULL, \`chat_room_id\` int NOT NULL, \`is_read\` tinyint NOT NULL COMMENT '1: unread, 0: read' DEFAULT '1', \`is_sent\` tinyint NOT NULL COMMENT '1: unsent, 0: sent' DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`status\` \`status\` tinyint NOT NULL COMMENT '0: Active, 1: Inactive, 2: Block' DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Students\` ADD CONSTRAINT \`FK_f4b5bee3333cba13807747d9a0d\` FOREIGN KEY (\`parent_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
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

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`ChatMessages\` DROP FOREIGN KEY \`FK_34c4a9d9100531d4d368340609b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`ChatMessages\` DROP FOREIGN KEY \`FK_e3553402bb734e9a0ddda95a913\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`ChatMessages\` DROP FOREIGN KEY \`FK_e1a560835c7699703879399fdc9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`ChatMessages\` DROP FOREIGN KEY \`FK_045a81b30c7f0284df51f7b7d32\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Students\` DROP FOREIGN KEY \`FK_f4b5bee3333cba13807747d9a0d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`status\` \`status\` tinyint NOT NULL COMMENT '0: Active, 1: Inactive' DEFAULT '0'`,
    );
    await queryRunner.query(`DROP TABLE \`ChatMessages\``);
    await queryRunner.query(`DROP TABLE \`Students\``);
    await queryRunner.query(`DROP TABLE \`ChatRooms\``);
  }
}
