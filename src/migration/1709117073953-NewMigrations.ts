import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1709117073953 implements MigrationInterface {
  name = 'NewMigrations1709117073953';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`quotes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`quote\` text NOT NULL, \`status\` tinyint NOT NULL COMMENT '0: Inactive, 1: Active' DEFAULT '0', \`lastDisplayedDate\` date NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`quotes\``);
  }
}
