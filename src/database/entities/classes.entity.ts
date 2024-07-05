import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../baseEntity';
import { Users } from './user.entity';
import { Schools } from './schools.entity';
import { TeacherClassMappings } from './teacher_class_mappings.entity';
import { Category } from './category.entity';
import { STATUS } from 'src/constants';
import { StudentClassMappings } from './student_class_mappings.entity';
import { SuppliesList } from './supplies_list.entity';
import { SubjectClassMappings } from './subject_class_mapping.entity';
import { NewsletterClassMappings } from './newsletter_class_mappings.entity';
import { BulletinUserClassMappings } from './bulletin_user_class_mapping.entity';

@Entity({ name: 'classes' })
@ObjectType()
export class Classes extends BaseEntity {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column({ type: 'text' })
  description: string;

  @Field(() => ID!)
  @Column({ comment: 'User who created this class' })
  user_id: number;

  @Field(() => ID!)
  @Column()
  school_id: number;

  @Field(() => ID, { nullable: true })
  @Column({ nullable: true })
  category_id: number;

  @Field()
  @Column({
    type: 'tinyint',
    default: STATUS.ACTIVE,
    comment: '0: Inactive, 1: Active',
  })
  status: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  image_url: string;

  @Field(() => Users)
  @ManyToOne(() => Users, (user) => user.classes)
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @Field(() => Schools)
  @ManyToOne(() => Schools, (schools) => schools.classes)
  @JoinColumn({ name: 'school_id' })
  schools: Schools;

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (category) => category.classes)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Field(() => [TeacherClassMappings])
  @OneToMany(
    () => TeacherClassMappings,
    (teacherClassMappings) => teacherClassMappings.class,
  )
  teacher_class_mappings: TeacherClassMappings[];

  @Field(() => [StudentClassMappings])
  @OneToMany(
    () => StudentClassMappings,
    (studentClassMapping) => studentClassMapping.class,
  )
  student_class_mappings: StudentClassMappings[];

  @Field(() => [SuppliesList])
  @OneToMany(() => SuppliesList, (supplies) => supplies.class)
  supplies: SuppliesList[];

  @Field(() => [SubjectClassMappings])
  @OneToMany(
    () => SubjectClassMappings,
    (subjectClassMappings) => subjectClassMappings.class,
  )
  subject_class_mappings: SubjectClassMappings[];

  @Field(() => [NewsletterClassMappings])
  @OneToMany(
    () => NewsletterClassMappings,
    (newsletterClassMappings) => newsletterClassMappings.class,
  )
  newsletter_class_mappings: NewsletterClassMappings[];

  @Field(() => [BulletinUserClassMappings])
  @OneToMany(
    () => BulletinUserClassMappings,
    (bulletinUserClassMappings) => bulletinUserClassMappings.classes,
  )
  bulletinUserClassMappings: BulletinUserClassMappings[];
}
