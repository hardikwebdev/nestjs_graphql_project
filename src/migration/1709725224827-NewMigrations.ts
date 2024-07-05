import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1709725224827 implements MigrationInterface {
  name = 'NewMigrations1709725224827';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`events\` ADD \`image_url\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`events\` DROP COLUMN \`image_url\``);
  }
}
