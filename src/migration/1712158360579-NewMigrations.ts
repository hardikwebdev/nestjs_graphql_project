import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1712158360579 implements MigrationInterface {
  name = 'NewMigrations1712158360579';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`announcement\` CHANGE \`is_published\` \`is_published\` tinyint NOT NULL COMMENT '0: Not published yet, 1: Published' DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`announcement\` CHANGE \`is_published\` \`is_published\` tinyint NOT NULL COMMENT '0: Not published yet, 1: Published' DEFAULT '1'`,
    );
  }
}
