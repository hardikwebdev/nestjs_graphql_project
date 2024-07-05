import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
class ListStudentsObject {
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
export class ListStudentsByTeacherSchools {
  @Field(() => [ListStudentsObject])
  students: ListStudentsObject[];
}
