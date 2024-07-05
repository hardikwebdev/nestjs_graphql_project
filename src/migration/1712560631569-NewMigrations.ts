import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1712560631569 implements MigrationInterface {
  name = 'NewMigrations1712560631569';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`video_streaming\` CHANGE \`video_url\` \`url_data\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_video_bookmarks\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`video_id\` int NOT NULL, \`user_id\` int NOT NULL, \`status\` tinyint NOT NULL COMMENT '0: inactive, 1: active' DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`video_streaming\` DROP COLUMN \`url_data\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`video_streaming\` ADD \`url_data\` json NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_video_bookmarks\` ADD CONSTRAINT \`FK_bea9ab28ea650f1a8e117a41f35\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_video_bookmarks\` ADD CONSTRAINT \`FK_aae18f3bdee14f7cf67b1d01745\` FOREIGN KEY (\`video_id\`) REFERENCES \`video_streaming\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_video_bookmarks\` DROP FOREIGN KEY \`FK_aae18f3bdee14f7cf67b1d01745\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_video_bookmarks\` DROP FOREIGN KEY \`FK_bea9ab28ea650f1a8e117a41f35\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`video_streaming\` DROP COLUMN \`url_data\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`video_streaming\` ADD \`url_data\` varchar(255) NULL`,
    );
    await queryRunner.query(`DROP TABLE \`user_video_bookmarks\``);
    await queryRunner.query(
      `ALTER TABLE \`video_streaming\` CHANGE \`url_data\` \`video_url\` varchar(255) NULL`,
    );
  }
}
