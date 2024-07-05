import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707904599647 implements MigrationInterface {
  name = 'NewMigrations1707904599647';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Students\` ADD \`profile_img\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Students\` DROP COLUMN \`profile_img\``,
    );
  }
}
