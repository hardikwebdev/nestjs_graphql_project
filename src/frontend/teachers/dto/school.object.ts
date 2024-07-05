import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SchoolInfo {
  @Field({ nullable: true })
  id?: number;

  @Field({ nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field({ nullable: true })
  latitude?: string;

  @Field({ nullable: true })
  longitude?: string;
}
