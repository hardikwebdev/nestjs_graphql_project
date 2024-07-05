import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1712669349548 implements MigrationInterface {
  name = 'NewMigrations1712669349548';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`zoom_call_meetings\` CHANGE \`attendee_type\` \`attendee_role\` tinyint NOT NULL COMMENT '0: Super admin, 1: parent, 2 : Teacher, 3: staff' DEFAULT '2'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`zoom_call_meetings\` CHANGE \`attendee_role\` \`attendee_type\` tinyint NOT NULL COMMENT '0: Super admin, 1: parent, 2 : Teacher, 3: staff' DEFAULT '2'`,
    );
  }
}
