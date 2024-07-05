import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { STATUS } from 'src/constants';
import {
  AfterLoad,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderDetails } from './order_details.entity';
import { UserCartDetails } from './cart.entity';

@ObjectType()
@Entity({ name: 'Products' })
export class Products {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string;

  @Field(() => Float)
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
  })
  price: number;

  @Field()
  @Column({ default: 0 })
  quantity: number;

  @Field()
  @Column({
    type: 'tinyint',
    default: STATUS.ACTIVE,
    comment: '0: Inactive, 1: Active',
  })
  status: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true, type: 'longtext' })
  imageUrlData: string;

  @Field()
  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;

  @Field()
  @DeleteDateColumn({
    type: 'timestamp',
  })
  deletedAt: Date;

  @Field(() => [OrderDetails])
  @OneToMany(() => OrderDetails, (orderDetails) => orderDetails.product)
  orderDetails: OrderDetails[];

  @Field(() => [UserCartDetails])
  @OneToMany(
    () => UserCartDetails,
    (user_cart_details) => user_cart_details.products,
  )
  user_cart_details: UserCartDetails[];

  @Field(() => [String], { nullable: true })
  imageUrl: string[];
  // Method to be called after the entity is loaded
  @AfterLoad()
  afterLoad() {
    // You can perform any actions on the entity after it is loaded
    if (this.imageUrlData) {
      try {
        this.imageUrl = JSON.parse(this.imageUrlData);
      } catch (error) {
        this.imageUrl = [];
      }
    } else {
      this.imageUrl = [];
    }
  }
}
