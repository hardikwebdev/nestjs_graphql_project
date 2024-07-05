import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707904724012 implements MigrationInterface {
  name = 'NewMigrations1707904724012';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_cart_details\` ADD \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_cart_details\` ADD \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_cart_details\` ADD \`deletedAt\` timestamp(6) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_cart_details\` DROP COLUMN \`deletedAt\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_cart_details\` DROP COLUMN \`updatedAt\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_cart_details\` DROP COLUMN \`createdAt\``,
    );
  }
}
