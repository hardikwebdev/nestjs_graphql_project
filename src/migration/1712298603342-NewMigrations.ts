import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1712298603342 implements MigrationInterface {
  name = 'NewMigrations1712298603342';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`reimbursement_requests\` CHANGE \`status\` \`status\` tinyint NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`reimbursement_requests\` CHANGE \`status\` \`status\` tinyint NOT NULL DEFAULT '1'`,
    );
  }
}
