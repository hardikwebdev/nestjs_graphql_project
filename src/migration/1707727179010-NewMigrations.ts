import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707727179010 implements MigrationInterface {
  name = 'NewMigrations1707727179010';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`paperworks\` ADD \`title\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`paperworks\` DROP COLUMN \`title\``);
  }
}
