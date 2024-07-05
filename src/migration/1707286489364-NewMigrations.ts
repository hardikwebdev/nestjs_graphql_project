import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707286489364 implements MigrationInterface {
  name = 'NewMigrations1707286489364';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Schools\` ADD \`email\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`Schools\` DROP COLUMN \`email\``);
  }
}
