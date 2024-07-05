import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1712148839112 implements MigrationInterface {
  name = 'NewMigrations1712148839112';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`announcement\` DROP COLUMN \`description\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`announcement\` DROP COLUMN \`title\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`announcement\` ADD \`subject\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`announcement\` ADD \`message\` longtext NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`announcement\` DROP COLUMN \`message\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`announcement\` DROP COLUMN \`subject\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`announcement\` ADD \`title\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`announcement\` ADD \`description\` varchar(255) NOT NULL`,
    );
  }
}
