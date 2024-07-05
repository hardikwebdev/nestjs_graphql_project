import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1710499601437 implements MigrationInterface {
  name = 'NewMigrations1710499601437';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sick_requests\` CHANGE \`type\` \`type\` enum ('time_off', 'sick') NOT NULL DEFAULT 'time_off'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sick_requests\` CHANGE \`type\` \`type\` enum ('time_off', 'sick') NOT NULL`,
    );
  }
}
