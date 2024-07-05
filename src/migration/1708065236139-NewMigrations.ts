import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1708065236139 implements MigrationInterface {
  name = 'NewMigrations1708065236139';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sockets\` DROP FOREIGN KEY \`FK_44f0363b269fe7db4ed13787409\``,
    );
    await queryRunner.query(`DROP TABLE \`sockets\``);
    await queryRunner.query(
      `CREATE TABLE \`group_members\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`user_id\` int NOT NULL, \`chat_room_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`group_members\` ADD CONSTRAINT \`FK_20a555b299f75843aa53ff8b0ee\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`group_members\` ADD CONSTRAINT \`FK_1dedfc20ba9986e7742a5e31002\` FOREIGN KEY (\`chat_room_id\`) REFERENCES \`chat_rooms\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`sockets\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`socket_id\` varchar(255) NOT NULL, \`user_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sockets\` ADD CONSTRAINT \`FK_44f0363b269fe7db4ed13787409\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`group_members\` DROP FOREIGN KEY \`FK_1dedfc20ba9986e7742a5e31002\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`group_members\` DROP FOREIGN KEY \`FK_20a555b299f75843aa53ff8b0ee\``,
    );
    await queryRunner.query(`DROP TABLE \`group_members\``);
  }
}
