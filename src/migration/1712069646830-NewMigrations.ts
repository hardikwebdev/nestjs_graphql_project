import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1712069646830 implements MigrationInterface {
  name = 'NewMigrations1712069646830';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`push_notifications\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`title\` varchar(255) NOT NULL, \`description\` longtext NOT NULL, \`is_read\` tinyint NOT NULL DEFAULT '0', \`user_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`push_notifications\` ADD CONSTRAINT \`FK_480d4ca21636b14c9eb93c70ebc\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`push_notifications\` DROP FOREIGN KEY \`FK_480d4ca21636b14c9eb93c70ebc\``,
    );
    await queryRunner.query(`DROP TABLE \`push_notifications\``);
  }
}
