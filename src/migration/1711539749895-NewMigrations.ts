import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1711539749895 implements MigrationInterface {
  name = 'NewMigrations1711539749895';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`bulletin_board\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`pdf_url\` varchar(255) NOT NULL, \`publish_date_time\` datetime NOT NULL, \`status\` tinyint NOT NULL COMMENT '0: Inactive, 1: Active' DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`bulletin_user_class_mapping\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`status\` tinyint NOT NULL COMMENT '0: inactive, 1: active' DEFAULT '1', \`class_id\` int NULL, \`user_id\` int NULL, \`bulletin_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bulletin_user_class_mapping\` ADD CONSTRAINT \`FK_0a1583698b53d8472e98a6ca2a5\` FOREIGN KEY (\`bulletin_id\`) REFERENCES \`bulletin_board\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bulletin_user_class_mapping\` ADD CONSTRAINT \`FK_cb4bd488e7e74b947d1747d4d75\` FOREIGN KEY (\`class_id\`) REFERENCES \`classes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bulletin_user_class_mapping\` ADD CONSTRAINT \`FK_9c5b73cecc94c274243bdc6eefe\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bulletin_user_class_mapping\` DROP FOREIGN KEY \`FK_9c5b73cecc94c274243bdc6eefe\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bulletin_user_class_mapping\` DROP FOREIGN KEY \`FK_cb4bd488e7e74b947d1747d4d75\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bulletin_user_class_mapping\` DROP FOREIGN KEY \`FK_0a1583698b53d8472e98a6ca2a5\``,
    );
    await queryRunner.query(`DROP TABLE \`bulletin_user_class_mapping\``);
    await queryRunner.query(`DROP TABLE \`bulletin_board\``);
  }
}
