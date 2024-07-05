import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, Column, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../baseEntity';
import { UserSchoolMappings } from './user_school_mapping.entity';
import { STATUS } from 'src/constants';
import { Classes } from './classes.entity';
import { Students } from './student.entity';
import { ChatRooms } from './chat_room.entity';
import { EventSchoolMappings } from './event_school_mappings.entity';

@ObjectType()
export class Gps {
  @Field()
  latitude: string;

  @Field()
  longitude: string;
}

@ObjectType()
@Entity({ name: 'Schools' })
export class Schools extends BaseEntity {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  address: string;

  @Field(() => Gps)
  @Column('simple-json')
  school_gps: { latitude: string; longitude: string };

  @Field(() => Int)
  @Column()
  parents_radius: number;

  @Field(() => Int)
  @Column()
  teachers_radius: number;

  @Field()
  @Column()
  qr_code: string;

  @Field()
  @Column()
  slug: string;

  @Field()
  @Column({
    type: 'tinyint',
    default: STATUS.ACTIVE,
    comment: '0: Inactive, 1: Active, 2: Block',
  }) // 0: Inactive, 1: Active, 2: Block
  status: number;

  @Field(() => [UserSchoolMappings])
  @OneToMany(
    () => UserSchoolMappings,
    (userSchoolMappings) => userSchoolMappings.schools,
    { cascade: true },
  )
  userSchoolMappings: UserSchoolMappings[];

  @Field(() => [Classes])
  @OneToMany(() => Classes, (classes) => classes.schools)
  classes: Classes[];

  @Field(() => [Students])
  @OneToMany(() => Students, (students) => students.school)
  students: Students[];

  @Field(() => ChatRooms)
  @OneToOne(() => ChatRooms, (chatRooms) => chatRooms.school)
  chat_room: ChatRooms;

  @Field(() => [EventSchoolMappings])
  @OneToMany(
    () => EventSchoolMappings,
    (eventSchoolMapping) => eventSchoolMapping.school,
  )
  eventSchoolMappings: EventSchoolMappings[];
}
