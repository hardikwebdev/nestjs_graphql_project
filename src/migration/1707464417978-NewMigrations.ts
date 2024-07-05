import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707464417978 implements MigrationInterface {
  name = 'NewMigrations1707464417978';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\` MODIFY \`username\` VARCHAR(45) NULL;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`users\`  MODIFY \`username\` VARCHAR(45) NOT NULL;`,
    );
  }
}
