import { Field, ID, ObjectType } from '@nestjs/graphql';
import { MessageObject } from 'src/commonGqlTypes/message.object';

@ObjectType()
export class ResendOTPObjectType extends MessageObject {
  @Field(() => ID)
  id: number;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  role: number;

  @Field()
  otp: string;
}
