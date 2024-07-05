import { Field, ObjectType } from '@nestjs/graphql';
import { MessageObject } from 'src/commonGqlTypes/message.object';
import { StudentInfo } from './studentInfo.object';

@ObjectType()
export class LoginTeacherParentObjectType extends MessageObject {
  @Field()
  id: number;

  @Field()
  email: string;

  @Field()
  role: number;

  @Field()
  firstname: string;

  @Field()
  lastname: string;

  @Field()
  username: string;

  @Field()
  status: number;

  @Field({ nullable: true })
  is_verified?: number;

  @Field({ nullable: true })
  is_mfa?: number;

  @Field({ nullable: true })
  otp?: string;

  @Field({ nullable: true })
  token?: string;

  @Field(() => [StudentInfo], { nullable: true })
  students?: StudentInfo[];
}
