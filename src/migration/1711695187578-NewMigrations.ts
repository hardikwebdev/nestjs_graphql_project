import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1711695187578 implements MigrationInterface {
  name = 'NewMigrations1711695187578';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`newsletter\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`title\` varchar(255) NOT NULL, \`description\` longtext NOT NULL, \`publish_date_time\` datetime NOT NULL, \`pdf_url\` varchar(255) NOT NULL, \`user_id\` int NOT NULL, \`status\` tinyint NOT NULL COMMENT '0: Inactive, 1: Active' DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`newsletter_class_mappings\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`newsletter_id\` int NOT NULL, \`class_id\` int NOT NULL, \`status\` tinyint NOT NULL COMMENT '0: inactive, 1: active' DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`newsletter_class_mappings\` ADD CONSTRAINT \`FK_187c59472cb46a7fcf9066fdc7f\` FOREIGN KEY (\`newsletter_id\`) REFERENCES \`newsletter\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`newsletter_class_mappings\` ADD CONSTRAINT \`FK_51c82f9743292faaae2e154863a\` FOREIGN KEY (\`class_id\`) REFERENCES \`classes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`newsletter_class_mappings\` DROP FOREIGN KEY \`FK_51c82f9743292faaae2e154863a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`newsletter_class_mappings\` DROP FOREIGN KEY \`FK_187c59472cb46a7fcf9066fdc7f\``,
    );
    await queryRunner.query(`DROP TABLE \`newsletter_class_mappings\``);
    await queryRunner.query(`DROP TABLE \`newsletter\``);
  }
}
