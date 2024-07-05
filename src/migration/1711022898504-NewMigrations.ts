import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1711022898504 implements MigrationInterface {
  name = 'NewMigrations1711022898504';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`log_events\` CHANGE \`event_type\` \`event_type\` enum ('absences', 'observations', 'check ins outs', 'photos', 'videos', 'miscellaneous', 'notes', 'foods', 'naps', 'potty', 'congratulations', 'incidents', 'health checks', 'medications') NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`log_events\` CHANGE \`event_type\` \`event_type\` enum ('event_1', 'event_2', 'event_3') NOT NULL DEFAULT 'event_1'`,
    );
  }
}
