import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1711093200170 implements MigrationInterface {
  name = 'NewMigrations1711093200170';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_plans\` DROP FOREIGN KEY \`FK_17f22d244eb7f26fd72c639916b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_plans\` CHANGE \`teacher_id\` \`user_id\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_plans\` ADD CONSTRAINT \`FK_d0d68f2bd1ec8a91f89e5325836\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`lesson_plans\` DROP FOREIGN KEY \`FK_d0d68f2bd1ec8a91f89e5325836\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_plans\` CHANGE \`user_id\` \`teacher_id\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lesson_plans\` ADD CONSTRAINT \`FK_17f22d244eb7f26fd72c639916b\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
