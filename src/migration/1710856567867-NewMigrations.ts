import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1710856567867 implements MigrationInterface {
  name = 'NewMigrations1710856567867';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`events\` CHANGE \`image_url\` \`event_images\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`events\` DROP COLUMN \`event_images\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`events\` ADD \`event_images\` longtext NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`events\` DROP COLUMN \`event_images\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`events\` ADD \`event_images\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`events\` CHANGE \`event_images\` \`image_url\` varchar(255) NOT NULL`,
    );
  }
}
