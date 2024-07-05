import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1710759949172 implements MigrationInterface {
  name = 'NewMigrations1710759949172';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`student_class_mappings\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`student_id\` int NOT NULL, \`class_id\` int NOT NULL, \`status\` int NOT NULL COMMENT '0: Inactive, 1: Active, 2: blocked' DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`student_class_mappings\` ADD CONSTRAINT \`FK_105ef6949ec40f8dd93bfd5bb6b\` FOREIGN KEY (\`student_id\`) REFERENCES \`Students\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`student_class_mappings\` ADD CONSTRAINT \`FK_e9d7b08cfa8c44c313a382ec96f\` FOREIGN KEY (\`class_id\`) REFERENCES \`classes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`student_class_mappings\` DROP FOREIGN KEY \`FK_e9d7b08cfa8c44c313a382ec96f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`student_class_mappings\` DROP FOREIGN KEY \`FK_105ef6949ec40f8dd93bfd5bb6b\``,
    );
    await queryRunner.query(`DROP TABLE \`student_class_mappings\``);
  }
}
