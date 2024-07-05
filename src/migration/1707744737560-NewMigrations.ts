import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707744737560 implements MigrationInterface {
  name = 'NewMigrations1707744737560';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Students\` ADD \`is_allergy\` tinyint NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Students\` CHANGE \`child_care_before\` \`child_care_before\` tinyint NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Students\` CHANGE \`transition_days\` \`transition_days\` tinyint NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Students\` CHANGE \`potty_trained\` \`potty_trained\` tinyint NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Students\` CHANGE \`lunch_program\` \`lunch_program\` tinyint NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Students\` CHANGE \`lunch_program\` \`lunch_program\` tinyint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Students\` CHANGE \`potty_trained\` \`potty_trained\` tinyint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Students\` CHANGE \`transition_days\` \`transition_days\` tinyint NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Students\` CHANGE \`child_care_before\` \`child_care_before\` tinyint NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Students\` DROP COLUMN \`is_allergy\``,
    );
  }
}
