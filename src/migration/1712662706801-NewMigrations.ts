import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1712662706801 implements MigrationInterface {
  name = 'NewMigrations1712662706801';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`zoom_call_meetings\` DROP FOREIGN KEY \`FK_1badbdd696ca335ebe8da023615\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`zoom_call_meetings\` CHANGE \`teacher_id\` \`user_id\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`zoom_call_meetings\` ADD CONSTRAINT \`FK_d47e22fce8570ccff6a01643f90\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`zoom_call_meetings\` ADD \`attendee_type\` tinyint NOT NULL COMMENT '0: Super admin, 1: parent, 2 : Teacher, 3: staff' DEFAULT '2'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`zoom_call_meetings\` DROP COLUMN \`attendee_type\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`zoom_call_meetings\` DROP FOREIGN KEY \`FK_d47e22fce8570ccff6a01643f90\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`zoom_call_meetings\` CHANGE \`user_id\` \`teacher_id\` int NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`zoom_call_meetings\` ADD CONSTRAINT \`FK_1badbdd696ca335ebe8da023615\` FOREIGN KEY (\`teacher_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
