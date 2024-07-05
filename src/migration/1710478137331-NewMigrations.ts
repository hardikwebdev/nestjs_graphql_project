import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1710478137331 implements MigrationInterface {
  name = 'NewMigrations1710478137331';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sick_requests\` DROP COLUMN \`hours\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sick_requests\` ADD \`start_time\` time NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sick_requests\` ADD \`end_time\` time NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sick_requests\` DROP COLUMN \`type\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sick_requests\` ADD \`type\` enum ('time_off', 'sick') NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sick_requests\` DROP COLUMN \`type\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sick_requests\` ADD \`type\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sick_requests\` DROP COLUMN \`end_time\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sick_requests\` DROP COLUMN \`start_time\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sick_requests\` ADD \`hours\` varchar(255) NOT NULL`,
    );
  }
}
