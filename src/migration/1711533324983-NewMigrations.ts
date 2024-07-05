import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1711533324983 implements MigrationInterface {
  name = 'NewMigrations1711533324983';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user_attendance\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`type\` enum ('clock_in_out', 'sick') NOT NULL DEFAULT 'clock_in_out', \`date\` date NOT NULL, \`logged_hours\` bigint NOT NULL DEFAULT '0', \`timeOff_hours\` bigint NOT NULL DEFAULT '0', \`user_id\` int NOT NULL, \`student_id\` int NULL, \`status\` tinyint NOT NULL COMMENT '0: inactive, 1: active' DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_attendance\` ADD CONSTRAINT \`FK_38a072ac5b19060b7442c77f76b\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_attendance\` ADD CONSTRAINT \`FK_75592596da6a4eb9d84026f11ef\` FOREIGN KEY (\`student_id\`) REFERENCES \`Students\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_attendance\` DROP FOREIGN KEY \`FK_75592596da6a4eb9d84026f11ef\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_attendance\` DROP FOREIGN KEY \`FK_38a072ac5b19060b7442c77f76b\``,
    );
    await queryRunner.query(`DROP TABLE \`user_attendance\``);
  }
}
