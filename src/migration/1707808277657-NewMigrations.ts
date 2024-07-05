import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707808277657 implements MigrationInterface {
  name = 'NewMigrations1707808277657';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`cms_page\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`title\` varchar(255) NOT NULL, \`pdf_url\` varchar(255) NULL, \`text\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`DROP TABLE \`GeneralPolicies\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`GeneralPolicies\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`content_type\` enum ('TERMS_CONDITIONS', 'PRIVACY_POLICY', 'EXCHANGE_RETURN_POLICY', 'PARENT_HANDBOOK') NOT NULL, \`title\` varchar(255) NOT NULL, \`pdf_url\` varchar(255) NULL, \`text\` text NULL, \`school_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`DROP TABLE \`cms_page\``);
  }
}
