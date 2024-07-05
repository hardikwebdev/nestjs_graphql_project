import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1711102878495 implements MigrationInterface {
  name = 'NewMigrations1711102878495';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`log_events\` CHANGE \`event_type\` \`event_type_id\` enum ('absences', 'observations', 'check ins outs', 'photos', 'videos', 'miscellaneous', 'notes', 'foods', 'naps', 'potty', 'congratulations', 'incidents', 'health checks', 'medications') NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE \`log_event_type\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`event_type\` enum ('absences', 'observations', 'check ins outs', 'photos', 'videos', 'miscellaneous', 'notes', 'foods', 'naps', 'potty', 'congratulations', 'incidents', 'health checks', 'medications') NOT NULL, \`image_url\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`log_events\` DROP COLUMN \`event_type_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`log_events\` ADD \`event_type_id\` int NULL COMMENT 'type of log event'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`log_events\` ADD CONSTRAINT \`FK_6e8ada987205ca01eac471e4362\` FOREIGN KEY (\`event_type_id\`) REFERENCES \`log_event_type\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`log_events\` DROP FOREIGN KEY \`FK_6e8ada987205ca01eac471e4362\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`log_events\` DROP COLUMN \`event_type_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`log_events\` ADD \`event_type_id\` enum ('absences', 'observations', 'check ins outs', 'photos', 'videos', 'miscellaneous', 'notes', 'foods', 'naps', 'potty', 'congratulations', 'incidents', 'health checks', 'medications') NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE \`log_event_type\``);
    await queryRunner.query(
      `ALTER TABLE \`log_events\` CHANGE \`event_type_id\` \`event_type\` enum ('absences', 'observations', 'check ins outs', 'photos', 'videos', 'miscellaneous', 'notes', 'foods', 'naps', 'potty', 'congratulations', 'incidents', 'health checks', 'medications') NOT NULL`,
    );
  }
}
