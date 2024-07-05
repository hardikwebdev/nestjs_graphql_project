import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707310057959 implements MigrationInterface {
  name = 'NewMigrations1707310057959';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Schools\` ADD \`slug\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`Schools\` DROP COLUMN \`slug\``);
  }
}
