import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707394519683 implements MigrationInterface {
  name = 'NewMigrations1707394519683';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`paperworks\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`paperwork_url\` varchar(255) NOT NULL, \`student_id\` int NOT NULL, \`user_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`paperworks\` ADD CONSTRAINT \`FK_e3ca445d4c55510bcf5fe39a635\` FOREIGN KEY (\`student_id\`) REFERENCES \`Students\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`paperworks\` ADD CONSTRAINT \`FK_9a46946760d6c99c53dd9e305b6\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`paperworks\` DROP FOREIGN KEY \`FK_9a46946760d6c99c53dd9e305b6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`paperworks\` DROP FOREIGN KEY \`FK_e3ca445d4c55510bcf5fe39a635\``,
    );
    await queryRunner.query(`DROP TABLE \`paperworks\``);
  }
}
