import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707734407203 implements MigrationInterface {
  name = 'NewMigrations1707734407203';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`sockets\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`socket_id\` varchar(255) NOT NULL, \`user_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`socket_id\``);
    await queryRunner.query(
      `ALTER TABLE \`sockets\` ADD CONSTRAINT \`FK_44f0363b269fe7db4ed13787409\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sockets\` DROP FOREIGN KEY \`FK_44f0363b269fe7db4ed13787409\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`socket_id\` varchar(255) NULL`,
    );
    await queryRunner.query(`DROP TABLE \`sockets\``);
  }
}
