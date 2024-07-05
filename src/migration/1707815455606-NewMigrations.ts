import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707815455606 implements MigrationInterface {
  name = 'NewMigrations1707815455606';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Students\` ADD \`school_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Students\` ADD CONSTRAINT \`FK_055748f5b8c17ff023bdcf49d49\` FOREIGN KEY (\`school_id\`) REFERENCES \`Schools\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Students\` DROP FOREIGN KEY \`FK_055748f5b8c17ff023bdcf49d49\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Students\` DROP COLUMN \`school_id\``,
    );
  }
}
