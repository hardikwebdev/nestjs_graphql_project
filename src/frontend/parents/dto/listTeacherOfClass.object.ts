import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TeacherObjectType } from './teacher.object';

@ObjectType()
export class ListTeacherByClassObject {
  @Field(() => Int, { nullable: true })
  total: number;

  @Field(() => [TeacherObjectType], { nullable: true })
  teachers?: TeacherObjectType[];
}
