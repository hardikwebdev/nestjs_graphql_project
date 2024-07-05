import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TeacherListingObject {
  @Field(() => Int)
  total: number;

  @Field(() => [TeacherObject], { nullable: true })
  teachers: TeacherObject[];
}

@ObjectType()
class TeacherObject {
  @Field(() => ID)
  id: number;

  @Field({ nullable: true })
  firstname: string;

  @Field({ nullable: true })
  lastname: string;

  @Field(() => Int, { nullable: true })
  role: number;

  @Field({ nullable: true })
  profile_img?: string;
}
