import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1712149233336 implements MigrationInterface {
  name = 'NewMigrations1712149233336';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`announcement\` ADD \`is_published\` tinyint NOT NULL COMMENT '0: Not published yet, 1: Published' DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`announcement\` DROP COLUMN \`is_published\``,
    );
  }
}
