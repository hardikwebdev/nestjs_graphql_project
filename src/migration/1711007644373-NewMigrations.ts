import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1711007644373 implements MigrationInterface {
  name = 'NewMigrations1711007644373';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`subscription_plan\` CHANGE \`interval\` \`interval\` enum ('30', '365', '180') NOT NULL DEFAULT '30'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`subscription_plan\` CHANGE \`interval\` \`interval\` enum ('1', '7', '30', '365') NOT NULL DEFAULT '30'`,
    );
  }
}
