import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1711029889601 implements MigrationInterface {
  name = 'NewMigrations1711029889601';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`lesson_plans\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`title\` varchar(255) NOT NULL, \`description\` longtext NOT NULL, \`pdf_url\` varchar(255) NULL, \`subject_id\` int NOT NULL, \`teacher_id\` int NOT NULL, \`status\` int NOT NULL DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`subjects\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, \`sub_title\` varchar(255) NOT NULL, \`description\` longtext NOT NULL, \`image\` varchar(255) NOT NULL, \`status\` int NOT NULL DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`subject_class_mappings\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`class_id\` int NOT NULL, \`subject_id\` int NOT NULL, \`status\` int NOT NULL DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_plans\` ADD CONSTRAINT \`FK_dd49b7a91e54e6f4c988d831821\` FOREIGN KEY (\`subject_id\`) REFERENCES \`subjects\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_plans\` ADD CONSTRAINT \`FK_17f22d244eb7f26fd72c639916b\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`subject_class_mappings\` ADD CONSTRAINT \`FK_a9bb1e9d995ec75aed847ab903b\` FOREIGN KEY (\`subject_id\`) REFERENCES \`subjects\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`subject_class_mappings\` ADD CONSTRAINT \`FK_f25252640c886adb04280c21e15\` FOREIGN KEY (\`class_id\`) REFERENCES \`classes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`subject_class_mappings\` DROP FOREIGN KEY \`FK_f25252640c886adb04280c21e15\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`subject_class_mappings\` DROP FOREIGN KEY \`FK_a9bb1e9d995ec75aed847ab903b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_plans\` DROP FOREIGN KEY \`FK_17f22d244eb7f26fd72c639916b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_plans\` DROP FOREIGN KEY \`FK_dd49b7a91e54e6f4c988d831821\``,
    );
    await queryRunner.query(`DROP TABLE \`subject_class_mappings\``);
    await queryRunner.query(`DROP TABLE \`subjects\``);
    await queryRunner.query(`DROP TABLE \`lesson_plans\``);
  }
}
