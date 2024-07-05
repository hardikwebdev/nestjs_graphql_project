import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1710162847334 implements MigrationInterface {
  name = 'NewMigrations1710162847334';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user_onboarding_documents\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`user_id\` int NOT NULL, \`slug\` varchar(255) NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`document_url\` varchar(255) NULL, \`status\` tinyint NOT NULL COMMENT '0: Inactive, 1: Active' DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_documents\` ADD CONSTRAINT \`FK_816ac0847751fb47a09ca93539f\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_documents\` DROP FOREIGN KEY \`FK_816ac0847751fb47a09ca93539f\``,
    );
    await queryRunner.query(`DROP TABLE \`user_onboarding_documents\``);
  }
}
