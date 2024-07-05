import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateTeacherProfileInput {
  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  firstname?: string;

  @Field({ nullable: true })
  lastname?: string;

  @Field({ nullable: true })
  phone_number?: string;

  @Field({ nullable: true })
  status?: number;

  @Field({ nullable: true })
  chat_feature?: number;

  @Field({ nullable: true })
  profile_image?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  position?: string;
}
