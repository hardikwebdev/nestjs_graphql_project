import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1711111334310 implements MigrationInterface {
  name = 'NewMigrations1711111334310';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`reimbursement_requests\` DROP COLUMN \`description\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`reimbursement_requests\` ADD \`description\` longtext NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`reimbursement_requests\` DROP COLUMN \`description\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`reimbursement_requests\` ADD \`description\` varchar(255) NOT NULL`,
    );
  }
}
