import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1712043939103 implements MigrationInterface {
  name = 'NewMigrations1712043939103';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_documents\` CHANGE \`status\` \`status\` tinyint NOT NULL COMMENT '0: Inactive, 1: Active' DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_onboarding_documents\` CHANGE \`status\` \`status\` tinyint NOT NULL COMMENT '0: Inactive, 1: Active' DEFAULT '0'`,
    );
  }
}
