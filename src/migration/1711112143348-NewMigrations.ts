import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1711112143348 implements MigrationInterface {
  name = 'NewMigrations1711112143348';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`classes\` ADD \`image_url\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`classes\` DROP COLUMN \`image_url\``,
    );
  }
}
