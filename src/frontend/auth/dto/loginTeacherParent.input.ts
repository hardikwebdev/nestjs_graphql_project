import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginTeacherParentInput {
  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  device_type: string;

  @Field()
  device_token: string;
}
