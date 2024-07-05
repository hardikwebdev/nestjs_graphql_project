import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1708587545306 implements MigrationInterface {
  name = 'NewMigrations1708587545306';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Products\` DROP COLUMN \`imageUrl\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Products\` ADD \`imageUrl\` json NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Products\` DROP COLUMN \`imageUrl\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Products\` ADD \`imageUrl\` varchar(255) NULL`,
    );
  }
}
