import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Students } from 'src/database/entities/student.entity';

@ObjectType()
class UserSchool {
  @Field()
  name: string;

  @Field(() => ID)
  id: number;
}

@ObjectType()
class UserSchoolMapping {
  @Field(() => ID, { nullable: true })
  schoolId: number;

  @Field(() => UserSchool, { nullable: true })
  schools: UserSchool;
}

@ObjectType()
export class UserObject {
  @Field(() => ID)
  id: number;

  @Field({ nullable: true })
  username: string;

  @Field()
  firstname: string;

  @Field()
  lastname: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  phone_number: string;

  @Field(() => Int)
  role: number;

  @Field(() => Int)
  status: number;

  @Field(() => Int)
  is_verified: number;

  @Field({ nullable: true })
  profile_img: string;

  @Field({ nullable: true })
  position: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => Int)
  chat_feature: number;

  @Field(() => Int, { nullable: true })
  studentCount?: number;

  @Field(() => [UserSchoolMapping], { nullable: true })
  userSchoolMappings: UserSchoolMapping[];

  @Field(() => [Students], { nullable: true })
  students: Students[];
}

@ObjectType()
export class ListUserObjectType {
  @Field(() => Int, { nullable: true })
  total: number;

  @Field(() => [UserObject])
  users: UserObject[];
}
