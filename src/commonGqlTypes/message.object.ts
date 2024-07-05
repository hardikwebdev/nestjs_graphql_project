import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class MessageObject {
  @Field()
  message: string;
}
