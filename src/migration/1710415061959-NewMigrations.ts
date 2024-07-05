import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1710415061959 implements MigrationInterface {
  name = 'NewMigrations1710415061959';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`log_events\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`event_type\` enum ('event_1', 'event_2', 'event_3') NOT NULL DEFAULT 'event_1', \`title\` varchar(255) NOT NULL, \`description\` longtext NOT NULL, \`teacher_id\` int NOT NULL COMMENT 'teacher who created this log event', \`student_id\` int NOT NULL, \`url_data\` json NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`log_events\` ADD CONSTRAINT \`FK_e00506da87aaa2873fffae1d305\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`log_events\` ADD CONSTRAINT \`FK_dd578e1ae9327cd8ac15eb1ec9e\` FOREIGN KEY (\`student_id\`) REFERENCES \`Students\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`log_events\` DROP FOREIGN KEY \`FK_dd578e1ae9327cd8ac15eb1ec9e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`log_events\` DROP FOREIGN KEY \`FK_e00506da87aaa2873fffae1d305\``,
    );
    await queryRunner.query(`DROP TABLE \`log_events\``);
  }
}
