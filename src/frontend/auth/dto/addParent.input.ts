import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AddParentInput {
  @Field({ nullable: true })
  username?: string;

  @Field()
  firstname: string;

  @Field()
  lastname: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  confirm_password: string;

  @Field({ nullable: true })
  phone_number: string;

  @Field({ nullable: true })
  token?: string;
}
