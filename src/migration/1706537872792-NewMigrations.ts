import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1706537872792 implements MigrationInterface {
  name = 'NewMigrations1706537872792';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`UserSchoolMappings\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`status\` tinyint NOT NULL COMMENT '0: active, 1: inactive' DEFAULT '0', \`schoolId\` int NOT NULL, \`userId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Orders\` DROP COLUMN \`totalPrice\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Order_items\` ADD \`is_returned\` int NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Order_items\` ADD \`is_exchanged\` tinyint NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Orders\` ADD \`total_price\` decimal(10,2) NOT NULL DEFAULT '0.00'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Orders\` ADD \`shipping_status\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`is_verified\` tinyint NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`profile_img\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`position\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`description\` text NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`is_mfa\` tinyint NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`socket_id\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Schools\` ADD \`qr_code\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Order_items\` DROP COLUMN \`price\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Order_items\` ADD \`price\` decimal(10,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`status\` \`status\` tinyint NOT NULL COMMENT '0: Active, 1: Inactive' DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`UserSchoolMappings\` ADD CONSTRAINT \`FK_5dbbf0f70a0b1740d8163a7da57\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`UserSchoolMappings\` ADD CONSTRAINT \`FK_04908d8e707bc672d3dd6876152\` FOREIGN KEY (\`schoolId\`) REFERENCES \`Schools\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`UserSchoolMappings\` DROP FOREIGN KEY \`FK_04908d8e707bc672d3dd6876152\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`UserSchoolMappings\` DROP FOREIGN KEY \`FK_5dbbf0f70a0b1740d8163a7da57\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`status\` \`status\` tinyint NOT NULL COMMENT '0: Inactive or Disable, 1: Active or Enable, 2: Invitation Accept Pending, 3: Users verification pending' DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Order_items\` DROP COLUMN \`price\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Order_items\` ADD \`price\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`Schools\` DROP COLUMN \`qr_code\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`socket_id\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`is_mfa\``);
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`description\``,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`position\``);
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`profile_img\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`is_verified\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Orders\` DROP COLUMN \`shipping_status\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Orders\` DROP COLUMN \`total_price\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Order_items\` DROP COLUMN \`is_exchanged\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Order_items\` DROP COLUMN \`is_returned\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Orders\` ADD \`totalPrice\` decimal NOT NULL DEFAULT '0.00'`,
    );
    await queryRunner.query(`DROP TABLE \`UserSchoolMappings\``);
  }
}
