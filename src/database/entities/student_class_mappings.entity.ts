import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../baseEntity';
import { STATUS } from 'src/constants';
import { Students } from './student.entity';
import { Classes } from './classes.entity';

@Entity({ name: 'student_class_mappings' })
@ObjectType()
export class StudentClassMappings extends BaseEntity {
  @Field(() => ID!)
  @Column()
  student_id: number;

  @Field(() => ID!)
  @Column()
  class_id: number;

  @Field(() => Int!)
  @Column({
    default: STATUS.ACTIVE,
    comment: '0: Inactive, 1: Active, 2: blocked',
  })
  status: number;

  @Field(() => Students)
  @ManyToOne(() => Students, (students) => students.student_class_mappings)
  @JoinColumn({ name: 'student_id' })
  student: Students;

  @Field(() => Classes)
  @ManyToOne(() => Classes, (classes) => classes.student_class_mappings)
  @JoinColumn({ name: 'class_id' })
  class: Classes;
}
