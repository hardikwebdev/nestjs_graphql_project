import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707831605900 implements MigrationInterface {
  name = 'NewMigrations1707831605900';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sick_requests\` DROP COLUMN \`date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sick_requests\` ADD \`date\` date NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sick_requests\` DROP COLUMN \`date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sick_requests\` ADD \`date\` varchar(255) NOT NULL`,
    );
  }
}
