import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigrations1707904525513 implements MigrationInterface {
  name = 'NewMigrations1707904525513';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user_cart_details\` (\`id\` int NOT NULL AUTO_INCREMENT, \`product_id\` int NOT NULL, \`user_id\` int NOT NULL, \`quantity\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_cart_details\` ADD CONSTRAINT \`FK_67e88d4ed31c0b65b0885e48ced\` FOREIGN KEY (\`product_id\`) REFERENCES \`Products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_cart_details\` ADD CONSTRAINT \`FK_3b0148cecb10f917ebcfe6f173e\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_cart_details\` DROP FOREIGN KEY \`FK_3b0148cecb10f917ebcfe6f173e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_cart_details\` DROP FOREIGN KEY \`FK_67e88d4ed31c0b65b0885e48ced\``,
    );
    await queryRunner.query(`DROP TABLE \`user_cart_details\``);
  }
}
