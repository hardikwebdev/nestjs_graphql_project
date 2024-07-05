import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1706105733342 implements MigrationInterface {
  name = 'NewMigrations1706105733342';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`Order_items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`price\` varchar(255) NOT NULL, \`quantity\` int NOT NULL, \`orderId\` int NOT NULL, \`productId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`Orders\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`totalPrice\` decimal(10,2) NOT NULL DEFAULT '0.00', \`userId\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Order_items\` ADD CONSTRAINT \`FK_1ac4d3890574d9eaf2df940dd3c\` FOREIGN KEY (\`orderId\`) REFERENCES \`Orders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Order_items\` ADD CONSTRAINT \`FK_c5077f5197fb5e38d2b0a519081\` FOREIGN KEY (\`productId\`) REFERENCES \`Products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Orders\` ADD CONSTRAINT \`FK_cc257418e0228f05a8d7dcc5553\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Orders\` DROP FOREIGN KEY \`FK_cc257418e0228f05a8d7dcc5553\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Order_items\` DROP FOREIGN KEY \`FK_c5077f5197fb5e38d2b0a519081\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Order_items\` DROP FOREIGN KEY \`FK_1ac4d3890574d9eaf2df940dd3c\``,
    );
    await queryRunner.query(`DROP TABLE \`Orders\``);
    await queryRunner.query(`DROP TABLE \`Order_items\``);
  }
}
