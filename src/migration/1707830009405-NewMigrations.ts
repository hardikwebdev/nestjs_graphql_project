import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707830009405 implements MigrationInterface {
  name = 'NewMigrations1707830009405';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`sick_requests\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`teacher_id\` int NOT NULL, \`reason\` varchar(255) NOT NULL, \`date\` varchar(255) NOT NULL, \`hours\` varchar(255) NOT NULL, \`status\` tinyint NOT NULL DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sick_requests\` ADD CONSTRAINT \`FK_a1ae1a3e922a8105fd27244a901\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sick_requests\` DROP FOREIGN KEY \`FK_a1ae1a3e922a8105fd27244a901\``,
    );
    await queryRunner.query(`DROP TABLE \`sick_requests\``);
  }
}
