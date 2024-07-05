import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707468147475 implements MigrationInterface {
  name = 'NewMigrations1707468147475';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`student_teacher_mappings\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`student_id\` int NOT NULL, \`teacher_id\` int NOT NULL COMMENT 'user id of teacher role from user table', \`status\` int NOT NULL COMMENT '0: active, 1: Inactive, 2: blocked' DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`classes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`user_id\` int NOT NULL COMMENT 'User who created this class', \`school_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`teacher_class_mappings\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`teacher_id\` int NOT NULL COMMENT 'user id of teacher role from user table', \`class_id\` int NOT NULL, \`status\` int NOT NULL COMMENT '0: active, 1: Inactive, 2: blocked' DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`student_class_mappings\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`student_id\` int NOT NULL, \`teacher_class_map_id\` int NOT NULL COMMENT 'id from TeacherClassMappings table', \`status\` int NOT NULL COMMENT '0: active, 1: Inactive, 2: blocked' DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`student_teacher_mappings\` ADD CONSTRAINT \`FK_234f0835d8d42b3069805e38be4\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`student_teacher_mappings\` ADD CONSTRAINT \`FK_dab39e00adfb2a8a0979f5b65fb\` FOREIGN KEY (\`student_id\`) REFERENCES \`Students\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`classes\` ADD CONSTRAINT \`FK_955ac25b387802b256a3e35aa95\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`classes\` ADD CONSTRAINT \`FK_398f3990f5da4a1efda173f576f\` FOREIGN KEY (\`school_id\`) REFERENCES \`Schools\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`teacher_class_mappings\` ADD CONSTRAINT \`FK_07d5736d172df4cf0cb5af6666a\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`teacher_class_mappings\` ADD CONSTRAINT \`FK_725b227c023d51d57b048fe9be6\` FOREIGN KEY (\`class_id\`) REFERENCES \`classes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`student_class_mappings\` ADD CONSTRAINT \`FK_105ef6949ec40f8dd93bfd5bb6b\` FOREIGN KEY (\`student_id\`) REFERENCES \`Students\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`student_class_mappings\` ADD CONSTRAINT \`FK_74f19ff0ed57081930ba43269b6\` FOREIGN KEY (\`teacher_class_map_id\`) REFERENCES \`teacher_class_mappings\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`student_class_mappings\` DROP FOREIGN KEY \`FK_74f19ff0ed57081930ba43269b6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`student_class_mappings\` DROP FOREIGN KEY \`FK_105ef6949ec40f8dd93bfd5bb6b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`teacher_class_mappings\` DROP FOREIGN KEY \`FK_725b227c023d51d57b048fe9be6\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`teacher_class_mappings\` DROP FOREIGN KEY \`FK_07d5736d172df4cf0cb5af6666a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`classes\` DROP FOREIGN KEY \`FK_398f3990f5da4a1efda173f576f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`classes\` DROP FOREIGN KEY \`FK_955ac25b387802b256a3e35aa95\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`student_teacher_mappings\` DROP FOREIGN KEY \`FK_dab39e00adfb2a8a0979f5b65fb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`student_teacher_mappings\` DROP FOREIGN KEY \`FK_234f0835d8d42b3069805e38be4\``,
    );
    await queryRunner.query(`DROP TABLE \`student_class_mappings\``);
    await queryRunner.query(`DROP TABLE \`teacher_class_mappings\``);
    await queryRunner.query(`DROP TABLE \`classes\``);
    await queryRunner.query(`DROP TABLE \`student_teacher_mappings\``);
  }
}
