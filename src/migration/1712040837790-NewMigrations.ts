import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1712040837790 implements MigrationInterface {
  name = 'NewMigrations1712040837790';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`onboarding_documents_list\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`document_name\` varchar(255) NOT NULL, \`for_teachers\` tinyint NOT NULL COMMENT '0: No, 1: Yes' DEFAULT '0', \`for_parents\` tinyint NOT NULL COMMENT '0: No, 1: Yes' DEFAULT '0', \`status\` tinyint NOT NULL COMMENT '0: inactive, 1: active' DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_documents\` DROP COLUMN \`slug\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_documents\` DROP COLUMN \`title\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_documents\` DROP COLUMN \`description\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_documents\` ADD \`document_id\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_documents\` ADD CONSTRAINT \`FK_59afeb2b2d938e5a1a6fc39a81b\` FOREIGN KEY (\`document_id\`) REFERENCES \`onboarding_documents_list\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_documents\` DROP FOREIGN KEY \`FK_59afeb2b2d938e5a1a6fc39a81b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_documents\` DROP COLUMN \`document_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_documents\` ADD \`description\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_documents\` ADD \`title\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_documents\` ADD \`slug\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE \`onboarding_documents_list\``);
  }
}
