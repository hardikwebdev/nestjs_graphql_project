import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1712757738328 implements MigrationInterface {
  name = 'NewMigrations1712757738328';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`exchange_return_requests\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`status\` tinyint NOT NULL COMMENT 'This status represent to exchange return request' DEFAULT '0', \`order_details_id\` int NOT NULL, \`user_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`exchange_return_requests\` ADD CONSTRAINT \`FK_8507b87c38523f66ae08106d2ad\` FOREIGN KEY (\`order_details_id\`) REFERENCES \`order_details\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`exchange_return_requests\` ADD CONSTRAINT \`FK_d3e1e75a4294b0546421c8608b5\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`exchange_return_requests\` DROP FOREIGN KEY \`FK_d3e1e75a4294b0546421c8608b5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`exchange_return_requests\` DROP FOREIGN KEY \`FK_8507b87c38523f66ae08106d2ad\``,
    );
    await queryRunner.query(`DROP TABLE \`exchange_return_requests\``);
  }
}
