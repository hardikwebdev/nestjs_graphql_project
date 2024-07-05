import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1712066179453 implements MigrationInterface {
  name = 'NewMigrations1712066179453';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`announcement\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`publish_date_time\` datetime NOT NULL, \`send_to\` enum ('teacher', 'parent', 'all', 'specific') NOT NULL DEFAULT 'all', \`status\` tinyint NOT NULL COMMENT '0: Inactive, 1: Active' DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`announcement_user__mapping\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`status\` tinyint NOT NULL COMMENT '0: inactive, 1: active' DEFAULT '1', \`user_id\` int NULL, \`announcement_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`announcement_user__mapping\` ADD CONSTRAINT \`FK_199ff63d5d4b8720044572a3f27\` FOREIGN KEY (\`announcement_id\`) REFERENCES \`announcement\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`announcement_user__mapping\` ADD CONSTRAINT \`FK_691dc83b7fa2eca2655a3c5e24e\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`announcement_user__mapping\` DROP FOREIGN KEY \`FK_691dc83b7fa2eca2655a3c5e24e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`announcement_user__mapping\` DROP FOREIGN KEY \`FK_199ff63d5d4b8720044572a3f27\``,
    );
    await queryRunner.query(`DROP TABLE \`announcement_user__mapping\``);
    await queryRunner.query(`DROP TABLE \`announcement\``);
  }
}
