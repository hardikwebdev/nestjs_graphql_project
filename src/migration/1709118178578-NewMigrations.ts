import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1709118178578 implements MigrationInterface {
  name = 'NewMigrations1709118178578';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Products\` DROP COLUMN \`imageUrl\``,
    );

    await queryRunner.query(
      `ALTER TABLE \`Products\` ADD \`imageUrlData\` longtext NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Products\` DROP COLUMN \`imageUrl\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Products\` ADD \`imageUrl\` json NULL`,
    );
  }
}
