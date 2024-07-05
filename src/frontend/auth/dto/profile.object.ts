import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProfileObjectType {
  @Field(() => ID)
  id: number;

  @Field({ nullable: true })
  token?: string;

  @Field()
  username: string;

  @Field()
  first_name: string;

  @Field()
  last_name: string;

  @Field()
  email: string;

  @Field()
  role: number;

  @Field()
  profile_img: string;

  @Field()
  phone_no: string;
}
