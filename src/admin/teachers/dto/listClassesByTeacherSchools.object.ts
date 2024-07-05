import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
class ListClassesObject {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  isAssign: boolean;
}

@ObjectType()
export class ListClassesByTeacherSchools {
  @Field(() => [ListClassesObject])
  classes: ListClassesObject[];
}
