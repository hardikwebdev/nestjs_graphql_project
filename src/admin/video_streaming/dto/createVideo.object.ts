import { Field, ObjectType } from '@nestjs/graphql';
import { MessageObject } from 'src/commonGqlTypes/message.object';

@ObjectType()
export class CreateVideoObject extends MessageObject {
  @Field(() => String, { nullable: true })
  upload_id: string;

  @Field(() => String, { nullable: true })
  upload_path: string;

  @Field(() => String, { nullable: true })
  message: string;
}
