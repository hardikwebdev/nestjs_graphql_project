import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707819441013 implements MigrationInterface {
  name = 'NewMigrations1707819441013';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Products\` CHANGE \`status\` \`status\` tinyint NOT NULL COMMENT '0: Inactive, 1: Active' DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Order_items\` CHANGE \`is_returned\` \`is_returned\` int NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Order_items\` CHANGE \`is_exchanged\` \`is_exchanged\` tinyint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`student_teacher_mappings\` CHANGE \`status\` \`status\` int NOT NULL COMMENT '0: Inactive, 1: Active, 2: blocked' DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Schools\` CHANGE \`status\` \`status\` tinyint NOT NULL COMMENT '0: Inactive, 1: Active, 2: Block' DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`teacher_class_mappings\` CHANGE \`status\` \`status\` int NOT NULL COMMENT '0: Inactive, 1: Active, 2: blocked' DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`student_class_mappings\` CHANGE \`status\` \`status\` int NOT NULL COMMENT '0: Inactive, 1: Active, 2: blocked' DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Students\` CHANGE \`status\` \`status\` tinyint NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Students\` CHANGE \`is_allergy\` \`is_allergy\` tinyint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ChatMessages\` CHANGE \`is_read\` \`is_read\` tinyint NOT NULL COMMENT '1: unread, 0: read' DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ChatMessages\` CHANGE \`is_sent\` \`is_sent\` tinyint NOT NULL COMMENT '1: unsent, 0: sent' DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`status\` \`status\` tinyint NOT NULL COMMENT '0: Inactive, 1: Active, 2: Block' DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`is_verified\` \`is_verified\` tinyint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`is_mfa\` \`is_mfa\` tinyint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`UserSchoolMappings\` CHANGE \`status\` \`status\` tinyint NOT NULL COMMENT '0: inactive, 1: active' DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`BlogsAndNews\` CHANGE \`status\` \`status\` tinyint NOT NULL COMMENT '0: Inactive, 1: Active' DEFAULT '1'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`BlogsAndNews\` CHANGE \`status\` \`status\` tinyint NOT NULL COMMENT '0: Active, 1: Inactive' DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`UserSchoolMappings\` CHANGE \`status\` \`status\` tinyint NOT NULL COMMENT '0: active, 1: inactive' DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`is_mfa\` \`is_mfa\` tinyint NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`is_verified\` \`is_verified\` tinyint NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`users\` CHANGE \`status\` \`status\` tinyint NOT NULL COMMENT '0: Active, 1: Inactive, 2: Block' DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ChatMessages\` CHANGE \`is_sent\` \`is_sent\` tinyint NOT NULL COMMENT '1: unsent, 0: sent' DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`ChatMessages\` CHANGE \`is_read\` \`is_read\` tinyint NOT NULL COMMENT '1: unread, 0: read' DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Students\` CHANGE \`is_allergy\` \`is_allergy\` tinyint NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Students\` CHANGE \`status\` \`status\` tinyint NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`student_class_mappings\` CHANGE \`status\` \`status\` int NOT NULL COMMENT '0: active, 1: Inactive, 2: blocked' DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`teacher_class_mappings\` CHANGE \`status\` \`status\` int NOT NULL COMMENT '0: active, 1: Inactive, 2: blocked' DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Schools\` CHANGE \`status\` \`status\` tinyint NOT NULL COMMENT '0: Active, 1: Inactive, 2: Block' DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`student_teacher_mappings\` CHANGE \`status\` \`status\` int NOT NULL COMMENT '0: active, 1: Inactive, 2: blocked' DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Order_items\` CHANGE \`is_exchanged\` \`is_exchanged\` tinyint NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Order_items\` CHANGE \`is_returned\` \`is_returned\` int NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Products\` CHANGE \`status\` \`status\` tinyint NOT NULL COMMENT '0: Active, 1: Inactive' DEFAULT '0'`,
    );
  }
}
