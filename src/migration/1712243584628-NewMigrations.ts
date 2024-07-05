import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1712243584628 implements MigrationInterface {
  name = 'NewMigrations1712243584628';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`zoom_call_meetings\``);
    await queryRunner.query(
      `CREATE TABLE \`zoom_call_meetings\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`date\` date NOT NULL, \`time_slot\` json NOT NULL, \`teacher_id\` int NOT NULL, \`parent_id\` int NOT NULL, \`student_id\` int NULL, \`is_approved\` tinyint NOT NULL DEFAULT '0', \`chat_message_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`zoom_call_meetings\` ADD CONSTRAINT \`FK_1badbdd696ca335ebe8da023615\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`zoom_call_meetings\` ADD CONSTRAINT \`FK_ad6fd04b523f782fe0319837ab6\` FOREIGN KEY (\`parent_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`zoom_call_meetings\` ADD CONSTRAINT \`FK_93b1399ede23af693cf444c847a\` FOREIGN KEY (\`student_id\`) REFERENCES \`Students\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`zoom_call_meetings\` ADD CONSTRAINT \`FK_1073b06137963ad3b629f85f02a\` FOREIGN KEY (\`chat_message_id\`) REFERENCES \`chat_messages\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`zoom_call_meetings\` DROP FOREIGN KEY \`FK_1073b06137963ad3b629f85f02a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`zoom_call_meetings\` DROP FOREIGN KEY \`FK_93b1399ede23af693cf444c847a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`zoom_call_meetings\` DROP FOREIGN KEY \`FK_ad6fd04b523f782fe0319837ab6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`zoom_call_meetings\` DROP FOREIGN KEY \`FK_1badbdd696ca335ebe8da023615\``,
    );
    await queryRunner.query(`DROP TABLE \`zoom_call_meetings\``);
  }
}
