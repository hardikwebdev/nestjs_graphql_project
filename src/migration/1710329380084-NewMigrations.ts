import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1710329380084 implements MigrationInterface {
  name = 'NewMigrations1710329380084';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order_details\` CHANGE \`shipping_status\` \`shipping_status\` enum ('ordered', 'delivered', 'shipped', 'picked_up_for_delevery', 'canceled') NOT NULL DEFAULT 'ordered'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order_details\` CHANGE \`shipping_status\` \`shipping_status\` enum ('ordered', 'delivered', 'shipped', 'picked_up_for_delevery') NOT NULL DEFAULT 'ordered'`,
    );
  }
}
