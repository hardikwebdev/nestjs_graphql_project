import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../baseEntity';
import { Users } from './user.entity';
import { ChatRooms } from './chat_room.entity';

@ObjectType()
@Entity({ name: 'group_members' })
export class GroupMembers extends BaseEntity {
  @Field(() => ID!)
  @Column()
  user_id: number;

  @Field(() => ID!)
  @Column()
  chat_room_id: number;

  @Field(() => Users)
  @ManyToOne(() => Users, (user) => user.group_members)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Field(() => ChatRooms)
  @ManyToOne(() => ChatRooms, (chatRooms) => chatRooms.group_members)
  @JoinColumn({ name: 'chat_room_id' })
  chat_room: ChatRooms;
}
