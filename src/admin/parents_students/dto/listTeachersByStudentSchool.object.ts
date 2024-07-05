import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
class ListTeachersObject {
  @Field(() => ID)
  id: number;

  @Field()
  firstname: string;

  @Field()
  lastname: string;

  @Field()
  isAssign: boolean;
}

@ObjectType()
export class ListTeachersByStudentSchoolsObject {
  @Field(() => [ListTeachersObject])
  teachers: ListTeachersObject[];
}
