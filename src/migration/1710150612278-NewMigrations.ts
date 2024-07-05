import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1710150612278 implements MigrationInterface {
  name = 'NewMigrations1710150612278';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`Order_items\``);
    await queryRunner.query(`DROP TABLE \`Orders\``);
    await queryRunner.query(
      `CREATE TABLE \`order_details\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`price\` decimal(10,2) NOT NULL, \`quantity\` int NOT NULL, \`shipping_status\` enum ('Ordered', 'Delivered', 'Shipped', 'Picked up for delevery', 'Returned', 'Exchange', 'Cancelled') NOT NULL DEFAULT 'Ordered', \`order_id\` int NOT NULL, \`product_id\` int NOT NULL, \`is_returned\` int NOT NULL DEFAULT '0', \`is_exchanged\` tinyint NOT NULL DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`orders\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`total_price\` decimal(10,2) NOT NULL DEFAULT '0.00', \`user_id\` int NOT NULL, \`payment_intent_id\` varchar(255) NULL, \`payment_intent_data\` longtext NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_details\` ADD CONSTRAINT \`FK_3ff3367344edec5de2355a562ee\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_details\` ADD CONSTRAINT \`FK_ce1f689e43b39edd9330cadaeb8\` FOREIGN KEY (\`product_id\`) REFERENCES \`Products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_a922b820eeef29ac1c6800e826a\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_a922b820eeef29ac1c6800e826a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_details\` DROP FOREIGN KEY \`FK_ce1f689e43b39edd9330cadaeb8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`order_details\` DROP FOREIGN KEY \`FK_3ff3367344edec5de2355a562ee\``,
    );
    await queryRunner.query(`DROP TABLE \`orders\``);
    await queryRunner.query(`DROP TABLE \`order_details\``);
  }
}
