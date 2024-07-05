import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1708000327620 implements MigrationInterface {
  name = 'NewMigrations1708000327620';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, \`status\` tinyint NOT NULL COMMENT '0: Inactive, 1: Active' DEFAULT '1', \`type\` enum ('lesson_plans', 'classes', 'event_activity') NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`category\``);
  }
}
