import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707910080546 implements MigrationInterface {
  name = 'NewMigrations1707910080546';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_cart_details\` ADD \`status\` tinyint NOT NULL COMMENT '0: Pending, 1: Ordered' DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_cart_details\` DROP COLUMN \`status\``,
    );
  }
}
