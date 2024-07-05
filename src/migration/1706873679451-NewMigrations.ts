import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1706873679451 implements MigrationInterface {
  name = 'NewMigrations1706873679451';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Schools\` ADD \`parents_gps\` text NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Schools\` ADD \`teachers_gps\` text NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Schools\` DROP COLUMN \`teachers_gps\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Schools\` DROP COLUMN \`parents_gps\``,
    );
  }
}
