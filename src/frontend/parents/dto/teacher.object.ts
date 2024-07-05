import { Field, ObjectType } from '@nestjs/graphql';
@ObjectType()
export class TeacherObjectType {
  @Field({ nullable: true })
  firstname?: string;

  @Field({ nullable: true })
  lastname: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  position?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  phone_number?: string;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  profile_img?: string;
}
