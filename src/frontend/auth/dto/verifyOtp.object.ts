import { Field, ObjectType } from '@nestjs/graphql';
import { MessageObject } from 'src/commonGqlTypes/message.object';
import { StudentInfo } from './studentInfo.object';

@ObjectType()
export class OTPObjectType extends MessageObject {
  @Field()
  token: string;

  @Field()
  id: number;

  @Field()
  username: string;

  @Field()
  firstname: string;

  @Field()
  lastname: string;

  @Field()
  email: string;

  @Field()
  role: number;

  @Field(() => [StudentInfo], { nullable: true })
  students?: StudentInfo[];
}
