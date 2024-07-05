import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
class ListClassesObjectType {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  isAssign: boolean;
}

@ObjectType()
export class ListClassesbyMapping {
  @Field(() => [ListClassesObjectType])
  classes: ListClassesObjectType[];
}
