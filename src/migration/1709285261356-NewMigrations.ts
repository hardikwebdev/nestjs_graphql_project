import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1709285261356 implements MigrationInterface {
  name = 'NewMigrations1709285261356';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sick_requests\` DROP COLUMN \`date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sick_requests\` ADD \`type\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sick_requests\` ADD \`start_date\` date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sick_requests\` ADD \`end_date\` date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sick_requests\` CHANGE \`status\` \`status\` tinyint NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sick_requests\` CHANGE \`status\` \`status\` tinyint NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sick_requests\` DROP COLUMN \`end_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sick_requests\` DROP COLUMN \`start_date\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sick_requests\` DROP COLUMN \`type\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sick_requests\` ADD \`date\` date NOT NULL`,
    );
  }
}
