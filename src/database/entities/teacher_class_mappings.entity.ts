import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../baseEntity';
import { Users } from './user.entity';
import { Classes } from './classes.entity';
import { STATUS } from 'src/constants';

@Entity({ name: 'teacher_class_mappings' })
@ObjectType()
export class TeacherClassMappings extends BaseEntity {
  @Field(() => ID!)
  @Column({ comment: 'user id of teacher role from user table' })
  teacher_id: number;

  @Field(() => ID!)
  @Column()
  class_id: number;

  @Field(() => Int!)
  @Column({
    default: STATUS.ACTIVE,
    comment: '0: Inactive, 1: Active, 2: blocked',
  })
  status: number;

  @Field(() => Users)
  @ManyToOne(() => Users, (user) => user.teacher_class_mapping)
  @JoinColumn({ name: 'teacher_id' })
  user: Users;

  @Field(() => Classes)
  @ManyToOne(() => Classes, (classes) => classes.teacher_class_mappings)
  @JoinColumn({ name: 'class_id' })
  class: Classes;
}
