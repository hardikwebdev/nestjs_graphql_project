import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1706797059087 implements MigrationInterface {
  name = 'NewMigrations1706797059087';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`GeneralPolicies\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`content_type\` enum ('TERMS_CONDITIONS', 'PRIVACY_POLICY', 'EXCHANGE_RETURN_POLICY', 'PARENT_HANDBOOK') NOT NULL, \`title\` varchar(255) NOT NULL, \`pdf_url\` varchar(255) NULL, \`text\` text NULL, \`school_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`GeneralPolicies\``);
  }
}
