import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../baseEntity';
import { STATUS } from 'src/constants';
import { Subjects } from './subject.entity';
import { Classes } from './classes.entity';

@ObjectType()
@Entity({ name: 'subject_class_mappings' })
export class SubjectClassMappings extends BaseEntity {
  @Field(() => ID!)
  @Column()
  class_id: number;

  @Field(() => ID!)
  @Column()
  subject_id: number;

  @Field(() => Int!)
  @Column({ default: STATUS.ACTIVE })
  status: number;

  @Field(() => Subjects, { nullable: true })
  @ManyToOne(() => Subjects, (subject) => subject.subject_class_mappings)
  @JoinColumn({ name: 'subject_id' })
  subject: Subjects;

  @Field(() => Classes, { nullable: true })
  @ManyToOne(() => Classes, (classes) => classes.subject_class_mappings)
  @JoinColumn({ name: 'class_id' })
  class: Classes;
}
