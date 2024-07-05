import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1710321042693 implements MigrationInterface {
  name = 'NewMigrations1710321042693';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order_details\` CHANGE \`shipping_status\` \`shipping_status\` enum ('ordered', 'delivered', 'shipped', 'picked_up_for_delevery') NOT NULL DEFAULT 'ordered'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order_details\` CHANGE \`shipping_status\` \`shipping_status\` enum ('Ordered', 'Delivered', 'Shipped', 'Picked up for delevery', 'Returned', 'Exchange', 'Cancelled') NOT NULL DEFAULT 'Ordered'`,
    );
  }
}
