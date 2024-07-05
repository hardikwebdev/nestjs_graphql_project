import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707482411551 implements MigrationInterface {
  name = 'NewMigrations1707482411551';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user_devices\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`device_type\` enum ('ANDROID', 'IOS') NOT NULL, \`device_token\` varchar(255) NOT NULL, \`user_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_devices\` ADD CONSTRAINT \`FK_28bd79e1b3f7c1168f0904ce241\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_devices\` DROP FOREIGN KEY \`FK_28bd79e1b3f7c1168f0904ce241\``,
    );
    await queryRunner.query(`DROP TABLE \`user_devices\``);
  }
}
