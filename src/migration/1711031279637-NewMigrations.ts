import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1711031279637 implements MigrationInterface {
  name = 'NewMigrations1711031279637';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`subjects\` CHANGE \`description\` \`description\` longtext NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`subjects\` CHANGE \`description\` \`description\` longtext NOT NULL`,
    );
  }
}
