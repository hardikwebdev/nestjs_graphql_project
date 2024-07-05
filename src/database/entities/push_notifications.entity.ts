import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../baseEntity';
import { Users } from './user.entity';
import { IS_READ } from 'src/constants';
import { GraphQLJSONObject } from 'graphql-type-json';

@ObjectType()
@Entity({ name: 'push_notifications' })
export class PushNotifications extends BaseEntity {
  @Field(() => String)
  @Column()
  title: string;

  @Field()
  @Column({ type: 'longtext' })
  description: string;

  @Field(() => Int)
  @Column({ type: 'tinyint', default: IS_READ.FALSE })
  is_read: number;

  @Field(() => String)
  @Column()
  type: string;

  @Field(() => ID!)
  @Column()
  from_user_id: number;

  @Field(() => ID!)
  @Column()
  to_user_id: number;

  @Field(() => String, { nullable: true })
  @Column({ type: 'longtext', nullable: true })
  body: string;

  @Field(() => Users)
  @ManyToOne(() => Users, (users) => users.from_push_notifications)
  @JoinColumn({ name: 'from_user_id' })
  from_user: Users;

  @Field(() => Users)
  @ManyToOne(() => Users, (users) => users.to_push_notifications)
  @JoinColumn({ name: 'to_user_id' })
  to_user: Users;

  @Field(() => GraphQLJSONObject, { nullable: true })
  notification_data: object;
  // Method to be called after the entity is loaded
  @AfterLoad()
  afterLoad() {
    // You can perform any actions on the entity after it is loaded
    if (this.body) {
      try {
        this.notification_data = JSON.parse(this.body);
      } catch (error) {
        this.notification_data = {};
      }
    } else {
      this.notification_data = {};
    }
  }
}
