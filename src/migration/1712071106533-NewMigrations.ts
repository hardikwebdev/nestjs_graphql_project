import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1712071106533 implements MigrationInterface {
  name = 'NewMigrations1712071106533';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`push_notifications\` DROP FOREIGN KEY \`FK_480d4ca21636b14c9eb93c70ebc\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`push_notifications\` DROP COLUMN \`user_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`push_notifications\` ADD \`from_user_id\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`push_notifications\` ADD \`to_user_id\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`push_notifications\` ADD CONSTRAINT \`FK_f030004e3576c99196f78df3ec3\` FOREIGN KEY (\`from_user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`push_notifications\` ADD CONSTRAINT \`FK_0e01f62e464cc2042b9425f54fc\` FOREIGN KEY (\`to_user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`push_notifications\` DROP FOREIGN KEY \`FK_0e01f62e464cc2042b9425f54fc\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`push_notifications\` DROP FOREIGN KEY \`FK_f030004e3576c99196f78df3ec3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`push_notifications\` DROP COLUMN \`to_user_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`push_notifications\` DROP COLUMN \`from_user_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`push_notifications\` ADD \`user_id\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`push_notifications\` ADD CONSTRAINT \`FK_480d4ca21636b14c9eb93c70ebc\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
