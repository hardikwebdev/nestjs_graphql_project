import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1711703177411 implements MigrationInterface {
  name = 'NewMigrations1711703177411';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bulletin_board\` DROP COLUMN \`description\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bulletin_board\` ADD \`description\` longtext NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bulletin_board\` DROP COLUMN \`description\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bulletin_board\` ADD \`description\` varchar(255) NOT NULL`,
    );
  }
}
