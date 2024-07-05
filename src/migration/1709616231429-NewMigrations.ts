import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1709616231429 implements MigrationInterface {
  name = 'NewMigrations1709616231429';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`events\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`event_date\` date NOT NULL, \`start_time\` time NOT NULL, \`end_time\` time NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`event_school_mappings\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`event_id\` int NOT NULL, \`school_id\` int NOT NULL, \`status\` tinyint NOT NULL COMMENT '0: Inactive, 1: Active' DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`cms_page\` ADD \`slug\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`event_school_mappings\` ADD CONSTRAINT \`FK_d0da8d43016d056a5b61eb4fc59\` FOREIGN KEY (\`event_id\`) REFERENCES \`events\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`event_school_mappings\` ADD CONSTRAINT \`FK_8791dd233ba399213fe61ae12a6\` FOREIGN KEY (\`school_id\`) REFERENCES \`Schools\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`event_school_mappings\` DROP FOREIGN KEY \`FK_8791dd233ba399213fe61ae12a6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`event_school_mappings\` DROP FOREIGN KEY \`FK_d0da8d43016d056a5b61eb4fc59\``,
    );
    await queryRunner.query(`ALTER TABLE \`cms_page\` DROP COLUMN \`slug\``);
    await queryRunner.query(`DROP TABLE \`event_school_mappings\``);
    await queryRunner.query(`DROP TABLE \`events\``);
  }
}
