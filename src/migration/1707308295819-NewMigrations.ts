import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707308295819 implements MigrationInterface {
  name = 'NewMigrations1707308295819';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`Schools\` DROP COLUMN \`latitude\``);
    await queryRunner.query(
      `ALTER TABLE \`Schools\` DROP COLUMN \`longitude\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Schools\` ADD \`school_gps\` text NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Schools\` DROP COLUMN \`school_gps\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Schools\` ADD \`longitude\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Schools\` ADD \`latitude\` varchar(255) NOT NULL`,
    );
  }
}
