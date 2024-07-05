import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707400917056 implements MigrationInterface {
  name = 'NewMigrations1707400917056';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\` (\`username\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\` (\`email\`)`,
    );
  }
}
