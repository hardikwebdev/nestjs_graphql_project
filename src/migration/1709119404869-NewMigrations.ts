import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1709119404869 implements MigrationInterface {
  name = 'NewMigrations1709119404869';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`roles_permissions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`role_id\` int NOT NULL, \`module\` varchar(255) NOT NULL, \`can_add\` tinyint NOT NULL COMMENT '0: false, 1: true' DEFAULT '1', \`can_update\` tinyint NOT NULL COMMENT '0: false, 1: true' DEFAULT '1', \`can_delete\` tinyint NOT NULL COMMENT '0: false, 1: true' DEFAULT '1', \`can_view\` tinyint NOT NULL COMMENT '0: false, 1: true' DEFAULT '1', \`status\` tinyint NOT NULL COMMENT '0: inactive, 1: active' DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`roles_permissions\` ADD CONSTRAINT \`FK_7d2dad9f14eddeb09c256fea719\` FOREIGN KEY (\`role_id\`) REFERENCES \`user_roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`roles_permissions\` DROP FOREIGN KEY \`FK_7d2dad9f14eddeb09c256fea719\``,
    );
    await queryRunner.query(`DROP TABLE \`roles_permissions\``);
  }
}
