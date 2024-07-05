import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1708073206212 implements MigrationInterface {
  name = 'NewMigrations1708073206212';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`clock_in_out_logs\` DROP COLUMN \`date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`clock_in_out_logs\` ADD \`date\` date NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`clock_in_out_logs\` DROP COLUMN \`date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`clock_in_out_logs\` ADD \`date\` timestamp NOT NULL`,
    );
  }
}
