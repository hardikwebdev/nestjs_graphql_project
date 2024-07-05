import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1706774102283 implements MigrationInterface {
  name = 'NewMigrations1706774102283';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`BlogsAndNews\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`content_type\` enum ('BLOG', 'NEWS') NOT NULL, \`title\` varchar(255) NOT NULL, \`pdf_url\` varchar(255) NOT NULL, \`school_id\` int NULL, \`status\` tinyint NOT NULL COMMENT '0: Active, 1: Inactive' DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`BlogsAndNews\``);
  }
}
