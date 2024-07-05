import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707984209672 implements MigrationInterface {
  name = 'NewMigrations1707984209672';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_devices\` DROP FOREIGN KEY \`FK_28bd79e1b3f7c1168f0904ce241\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_devices\` CHANGE \`user_id\` \`user_id\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_devices\` ADD CONSTRAINT \`FK_28bd79e1b3f7c1168f0904ce241\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_devices\` DROP FOREIGN KEY \`FK_28bd79e1b3f7c1168f0904ce241\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_devices\` CHANGE \`user_id\` \`user_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_devices\` ADD CONSTRAINT \`FK_28bd79e1b3f7c1168f0904ce241\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
