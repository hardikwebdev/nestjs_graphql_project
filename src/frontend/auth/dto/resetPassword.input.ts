import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ResetPasswordForTeacherParent {
  @Field()
  email: string;

  @Field()
  new_password: string;

  @Field()
  reset_token: string;
}
