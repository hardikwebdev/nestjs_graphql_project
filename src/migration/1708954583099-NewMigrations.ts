import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1708954583099 implements MigrationInterface {
  name = 'NewMigrations1708954583099';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`subscription_plan\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`android_plan_id\` varchar(255) NOT NULL, \`ios_plan_id\` varchar(255) NOT NULL, \`price\` decimal(10,2) NOT NULL DEFAULT '0.00', \`interval\` enum ('1', '7', '30', '365') NOT NULL DEFAULT '30', \`status\` tinyint NOT NULL COMMENT '0: Inactive, 1: Active' DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`subscribed_users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`transaction_id\` varchar(255) NOT NULL, \`device_type\` enum ('android', 'ios') NOT NULL DEFAULT 'ios', \`receipt\` text NOT NULL, \`start_date\` timestamp NOT NULL, \`end_date\` timestamp NOT NULL, \`user_id\` int NOT NULL, \`plan_id\` int NOT NULL, \`cron_check\` tinyint NOT NULL COMMENT '0: Cancelled, 1: Active, 2: Completed' DEFAULT '1', \`auto_renew\` tinyint NOT NULL COMMENT '0: False, 1: True' DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`subscribed_users\` ADD CONSTRAINT \`FK_117555aaa90404784ba80a4ab10\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`subscribed_users\` ADD CONSTRAINT \`FK_21876b63e3d37d992cedb0e3404\` FOREIGN KEY (\`plan_id\`) REFERENCES \`subscription_plan\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`subscribed_users\` DROP FOREIGN KEY \`FK_21876b63e3d37d992cedb0e3404\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`subscribed_users\` DROP FOREIGN KEY \`FK_117555aaa90404784ba80a4ab10\``,
    );
    await queryRunner.query(`DROP TABLE \`subscribed_users\``);
    await queryRunner.query(`DROP TABLE \`subscription_plan\``);
  }
}
