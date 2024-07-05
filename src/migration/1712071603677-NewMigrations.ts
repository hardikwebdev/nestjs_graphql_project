import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1712071603677 implements MigrationInterface {
  name = 'NewMigrations1712071603677';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`push_notifications\` ADD \`type\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`push_notifications\` ADD \`body\` longtext NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`push_notifications\` DROP COLUMN \`body\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`push_notifications\` DROP COLUMN \`type\``,
    );
  }
}
