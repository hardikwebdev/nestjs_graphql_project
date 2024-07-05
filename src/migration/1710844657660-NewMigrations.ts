import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1710844657660 implements MigrationInterface {
  name = 'NewMigrations1710844657660';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`events\` DROP COLUMN \`description\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`events\` ADD \`description\` longtext NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`events\` DROP COLUMN \`description\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`events\` ADD \`description\` varchar(255) NOT NULL`,
    );
  }
}
