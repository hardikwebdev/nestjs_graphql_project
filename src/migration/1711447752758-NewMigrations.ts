import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1711447752758 implements MigrationInterface {
  name = 'NewMigrations1711447752758';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`lesson_plan_attachments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`title\` varchar(255) NOT NULL, \`description\` longtext NOT NULL, \`pdf_url\` varchar(255) NULL, \`user_id\` int NOT NULL, \`status\` tinyint NOT NULL DEFAULT '1', \`lesson_plan_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_plans\` DROP COLUMN \`pdf_url\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_plan_attachments\` ADD CONSTRAINT \`FK_68e4814a77d8c9f15ae40db5789\` FOREIGN KEY (\`lesson_plan_id\`) REFERENCES \`lesson_plans\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_plan_attachments\` ADD CONSTRAINT \`FK_09824d7b3755a997506a32c71c4\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_plan_attachments\` DROP FOREIGN KEY \`FK_09824d7b3755a997506a32c71c4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_plan_attachments\` DROP FOREIGN KEY \`FK_68e4814a77d8c9f15ae40db5789\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_plans\` ADD \`pdf_url\` longtext NULL`,
    );
    await queryRunner.query(`DROP TABLE \`lesson_plan_attachments\``);
  }
}
