import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1709906249762 implements MigrationInterface {
  name = 'NewMigrations1709906249762';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`event_rsvp\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`event_id\` int NOT NULL, \`parent_id\` int NOT NULL, \`student_id\` int NOT NULL, \`is_attending\` tinyint NOT NULL COMMENT '0: no, 1: yes' DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`event_rsvp\` ADD CONSTRAINT \`FK_8062a5e2bde78e576ff7c66a98a\` FOREIGN KEY (\`event_id\`) REFERENCES \`events\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`event_rsvp\` ADD CONSTRAINT \`FK_7d1e7e6499eb4b31842db3967c2\` FOREIGN KEY (\`parent_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`event_rsvp\` ADD CONSTRAINT \`FK_e4398f1bb3991c6e97546501da5\` FOREIGN KEY (\`student_id\`) REFERENCES \`Students\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`event_rsvp\` DROP FOREIGN KEY \`FK_e4398f1bb3991c6e97546501da5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`event_rsvp\` DROP FOREIGN KEY \`FK_7d1e7e6499eb4b31842db3967c2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`event_rsvp\` DROP FOREIGN KEY \`FK_8062a5e2bde78e576ff7c66a98a\``,
    );
    await queryRunner.query(`DROP TABLE \`event_rsvp\``);
  }
}
