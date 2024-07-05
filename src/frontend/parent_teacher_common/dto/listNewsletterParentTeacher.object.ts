import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Newsletter } from 'src/database/entities/newsletter.entity';

@ObjectType()
export class ListNewsletterParentTeacherObject {
  @Field(() => Int)
  total: number;

  @Field(() => [Newsletter])
  newsletter: Newsletter[];
}
