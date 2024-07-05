import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class StudentInfo {
  @Field({ nullable: true })
  id?: number;

  @Field({ nullable: true })
  firstname?: string;

  @Field({ nullable: true })
  lastname?: string;

  @Field(() => String, { nullable: true })
  birthdate?: Date;

  @Field({ nullable: true })
  profile_img?: string;
}
