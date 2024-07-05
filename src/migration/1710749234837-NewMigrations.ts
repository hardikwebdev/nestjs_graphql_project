import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1710749234837 implements MigrationInterface {
  name = 'NewMigrations1710749234837';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`supplies_list\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, \`content\` text NOT NULL, \`class_id\` int NOT NULL, \`status\` tinyint NOT NULL COMMENT '0: Inactive, 1: Active' DEFAULT '1', \`availibility\` tinyint NOT NULL COMMENT '0:NO, 1:YES' DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`supplies_list\` ADD CONSTRAINT \`FK_8785e3bf41f2c58e039401c6137\` FOREIGN KEY (\`class_id\`) REFERENCES \`classes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`supplies_list\` DROP FOREIGN KEY \`FK_8785e3bf41f2c58e039401c6137\``,
    );
    await queryRunner.query(`DROP TABLE \`supplies_list\``);
  }
}
