import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707825453743 implements MigrationInterface {
  name = 'NewMigrations1707825453743';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`zoom_call_timing\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`date\` date NOT NULL, \`time_slots\` text NOT NULL, \`teacher_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`chat_feature\` tinyint NOT NULL COMMENT '0: Disable, 1: Enable' DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`zoom_call_timing\` ADD CONSTRAINT \`FK_dd28977c108d017770477803415\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`zoom_call_timing\` DROP FOREIGN KEY \`FK_dd28977c108d017770477803415\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` DROP COLUMN \`chat_feature\``,
    );
    await queryRunner.query(`DROP TABLE \`zoom_call_timing\``);
  }
}
