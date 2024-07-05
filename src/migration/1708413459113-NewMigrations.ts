import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1708413459113 implements MigrationInterface {
  name = 'NewMigrations1708413459113';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`classes\` ADD \`category_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`classes\` ADD CONSTRAINT \`FK_7f3d4d1ac00ffae553798f09d12\` FOREIGN KEY (\`category_id\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`classes\` DROP FOREIGN KEY \`FK_7f3d4d1ac00ffae553798f09d12\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`classes\` DROP COLUMN \`category_id\``,
    );
  }
}
