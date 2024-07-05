import { Field, ObjectType } from '@nestjs/graphql';
import { MessageObject } from 'src/commonGqlTypes/message.object';
import { Newsletter } from 'src/database/entities/newsletter.entity';

@ObjectType()
export class AddNewsletterObject extends MessageObject {
  @Field(() => Newsletter)
  newsletter: Newsletter;
}
