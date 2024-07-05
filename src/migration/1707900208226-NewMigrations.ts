import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707900208226 implements MigrationInterface {
  name = 'NewMigrations1707900208226';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`zoom_call_timing\` DROP COLUMN \`time_slots\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`zoom_call_timing\` ADD \`time_slots\` json NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`zoom_call_timing\` DROP COLUMN \`time_slots\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`zoom_call_timing\` ADD \`time_slots\` text NOT NULL`,
    );
  }
}
