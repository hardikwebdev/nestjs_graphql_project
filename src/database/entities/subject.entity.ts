import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../baseEntity';
import { SubjectClassMappings } from './subject_class_mapping.entity';
import { LessonPlans } from './lesson_plans.entity';
import { STATUS } from 'src/constants';

@ObjectType()
@Entity({ name: 'subjects' })
export class Subjects extends BaseEntity {
  @Field(() => String!)
  @Column()
  name: string;

  @Field(() => String!)
  @Column()
  sub_title: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'longtext', nullable: true })
  description: string;

  @Field(() => String!)
  @Column()
  image: string;

  @Field(() => Int!)
  @Column({ default: STATUS.ACTIVE })
  status: number;

  @Field(() => [SubjectClassMappings])
  @OneToMany(
    () => SubjectClassMappings,
    (subjectClassMappings) => subjectClassMappings.subject,
    { cascade: true },
  )
  subject_class_mappings: SubjectClassMappings[];

  @Field(() => [LessonPlans], { nullable: true })
  @OneToMany(() => LessonPlans, (lessonPlans) => lessonPlans.subject, {
    cascade: true,
  })
  lesson_plans: LessonPlans[];
}
