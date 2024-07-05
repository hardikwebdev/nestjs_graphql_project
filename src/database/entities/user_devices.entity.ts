import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../baseEntity';
import { Users } from './user.entity';

export enum DeviceType {
  ANDROID = 'ANDROID',
  IOS = 'IOS',
}

@ObjectType()
@Entity({ name: 'user_devices' })
export class UserDevice extends BaseEntity {
  @Column({
    type: 'enum',
    enum: DeviceType,
  })
  device_type: string;

  @Field()
  @Column()
  device_token: string;

  @Field()
  @Column()
  user_id: number;

  @Field(() => Users)
  @ManyToOne(() => Users, (user) => user.devices)
  @JoinColumn({ name: 'user_id' })
  users: Users;
}
