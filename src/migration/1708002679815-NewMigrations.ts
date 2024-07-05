import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1708002679815 implements MigrationInterface {
  name = 'NewMigrations1708002679815';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`clock_in_out_logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`type\` enum ('clock_in', 'clock_out', 'break_start', 'break_end', 'pickup', 'drop_off') NOT NULL DEFAULT 'clock_in', \`date\` timestamp NOT NULL, \`user_id\` int NOT NULL, \`student_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`clock_in_out_logs\` ADD CONSTRAINT \`FK_67b9819e505f80ece45f9340273\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`clock_in_out_logs\` ADD CONSTRAINT \`FK_03492d1b186d651af994ae80595\` FOREIGN KEY (\`student_id\`) REFERENCES \`Students\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`clock_in_out_logs\` DROP FOREIGN KEY \`FK_03492d1b186d651af994ae80595\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`clock_in_out_logs\` DROP FOREIGN KEY \`FK_67b9819e505f80ece45f9340273\``,
    );
    await queryRunner.query(`DROP TABLE \`clock_in_out_logs\``);
  }
}
