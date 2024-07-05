import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707383997887 implements MigrationInterface {
  name = 'NewMigrations1707383997887';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Schools\` DROP COLUMN \`parents_gps\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Schools\` DROP COLUMN \`teachers_gps\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Schools\` ADD \`parents_radius\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Schools\` ADD \`teachers_radius\` int NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Schools\` DROP COLUMN \`teachers_radius\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Schools\` DROP COLUMN \`parents_radius\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Schools\` ADD \`teachers_gps\` text NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Schools\` ADD \`parents_gps\` text NULL`,
    );
  }
}
