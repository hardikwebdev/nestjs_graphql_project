import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StudentBasicData {
  @Field({ nullable: true })
  firstname?: string;

  @Field({ nullable: true })
  lastname?: string;

  @Field({ nullable: true })
  email?: string;
}
