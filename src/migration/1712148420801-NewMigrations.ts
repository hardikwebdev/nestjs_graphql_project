import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1712148420801 implements MigrationInterface {
  name = 'NewMigrations1712148420801';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`announcement_user__mapping\``);
    await queryRunner.query(
      `CREATE TABLE \`announcement_user_mapping\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`status\` tinyint NOT NULL COMMENT '0: inactive, 1: active' DEFAULT '1', \`user_id\` int NULL, \`announcement_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`announcement_user_mapping\` ADD CONSTRAINT \`FK_e7230da5657afc0b04a14a27eaa\` FOREIGN KEY (\`announcement_id\`) REFERENCES \`announcement\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`announcement_user_mapping\` ADD CONSTRAINT \`FK_8489a1eae4c8bb631837bf9b57e\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`announcement_user__mapping\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`status\` tinyint NOT NULL COMMENT '0: inactive, 1: active' DEFAULT '1', \`user_id\` int NULL, \`announcement_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`announcement_user__mapping\` ADD CONSTRAINT \`FK_199ff63d5d4b8720044572a3f27\` FOREIGN KEY (\`announcement_id\`) REFERENCES \`announcement\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`announcement_user__mapping\` ADD CONSTRAINT \`FK_691dc83b7fa2eca2655a3c5e24e\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`announcement_user_mapping\` DROP FOREIGN KEY \`FK_8489a1eae4c8bb631837bf9b57e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`announcement_user_mapping\` DROP FOREIGN KEY \`FK_e7230da5657afc0b04a14a27eaa\``,
    );
    await queryRunner.query(`DROP TABLE \`announcement_user_mapping\``);
  }
}
