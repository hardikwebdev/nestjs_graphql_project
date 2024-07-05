import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707995820613 implements MigrationInterface {
  name = 'NewMigrations1707995820613';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`ChatRooms\` ADD \`school_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ChatRooms\` ADD UNIQUE INDEX \`IDX_a7577edee27d089bf8aa078ec9\` (\`school_id\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_a7577edee27d089bf8aa078ec9\` ON \`ChatRooms\` (\`school_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ChatRooms\` ADD CONSTRAINT \`FK_a7577edee27d089bf8aa078ec97\` FOREIGN KEY (\`school_id\`) REFERENCES \`Schools\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`ChatRooms\` DROP FOREIGN KEY \`FK_a7577edee27d089bf8aa078ec97\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_a7577edee27d089bf8aa078ec9\` ON \`ChatRooms\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`ChatRooms\` DROP INDEX \`IDX_a7577edee27d089bf8aa078ec9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`ChatRooms\` DROP COLUMN \`school_id\``,
    );
  }
}
