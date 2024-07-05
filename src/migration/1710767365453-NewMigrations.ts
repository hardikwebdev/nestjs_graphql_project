import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1710767365453 implements MigrationInterface {
  name = 'NewMigrations1710767365453';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`video_streaming\` CHANGE \`title\` \`title\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`video_streaming\` CHANGE \`description\` \`description\` longtext NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`video_streaming\` CHANGE \`video_url\` \`video_url\` varchar(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`video_streaming\` CHANGE \`video_url\` \`video_url\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`video_streaming\` CHANGE \`description\` \`description\` longtext NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`video_streaming\` CHANGE \`title\` \`title\` varchar(255) NOT NULL`,
    );
  }
}
