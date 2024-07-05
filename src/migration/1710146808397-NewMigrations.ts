import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1710146808397 implements MigrationInterface {
  name = 'NewMigrations1710146808397';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`subscription_plan\` DROP COLUMN \`description\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`subscription_plan\` ADD \`description\` longtext NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`subscription_plan\` DROP COLUMN \`description\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`subscription_plan\` ADD \`description\` varchar(255) NOT NULL`,
    );
  }
}
