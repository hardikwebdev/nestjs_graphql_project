import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707892019515 implements MigrationInterface {
  name = 'NewMigrations1707892019515';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`reimbursement_requests\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`teacher_id\` int NOT NULL, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`amount\` decimal(10,2) NOT NULL DEFAULT '0.00', \`image_url\` varchar(255) NULL, \`type\` enum ('image', 'pdf') NULL, \`status\` tinyint NOT NULL DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`reimbursement_requests\` ADD CONSTRAINT \`FK_7eadc9dabb60c6f01666b6b177c\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`reimbursement_requests\` DROP FOREIGN KEY \`FK_7eadc9dabb60c6f01666b6b177c\``,
    );
    await queryRunner.query(`DROP TABLE \`reimbursement_requests\``);
  }
}
