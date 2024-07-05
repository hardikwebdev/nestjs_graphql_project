import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1711122241650 implements MigrationInterface {
  name = 'NewMigrations1711122241650';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user_recent_logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`type\` enum ('clock_in', 'clock_out', 'break_start', 'break_end', 'pickup', 'drop_off', 'time_off', 'sick') NOT NULL DEFAULT 'clock_in', \`user_id\` int NOT NULL, \`student_id\` int NULL, \`date\` date NOT NULL, \`reason\` longtext NULL, \`start_time\` time NULL, \`end_time\` time NULL, \`status\` tinyint NULL COMMENT 'This status represent to sick and time_off request', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_recent_logs\` ADD CONSTRAINT \`FK_4fbf5819c03477c41b2b6339576\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_recent_logs\` ADD CONSTRAINT \`FK_a451c75c5778e12d607a07cdcb6\` FOREIGN KEY (\`student_id\`) REFERENCES \`Students\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_recent_logs\` DROP FOREIGN KEY \`FK_a451c75c5778e12d607a07cdcb6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_recent_logs\` DROP FOREIGN KEY \`FK_4fbf5819c03477c41b2b6339576\``,
    );
    await queryRunner.query(`DROP TABLE \`user_recent_logs\``);
  }
}
