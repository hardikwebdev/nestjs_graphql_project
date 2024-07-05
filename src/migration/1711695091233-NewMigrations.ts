import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1711695091233 implements MigrationInterface {
  name = 'NewMigrations1711695091233';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bulletin_board\` ADD \`is_class_assigned\` tinyint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bulletin_board\` ADD \`is_teacher_assigned\` tinyint NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bulletin_board\` DROP COLUMN \`is_teacher_assigned\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`bulletin_board\` DROP COLUMN \`is_class_assigned\``,
    );
  }
}
