import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MessageObject } from 'src/commonGqlTypes/message.object';
import { BlogsAndNews } from 'src/database/entities/blogs_news.entity';

@ObjectType()
export class ListAllNewsObject extends MessageObject {
  @Field(() => Int)
  total: number;

  @Field(() => [BlogsAndNews])
  news: BlogsAndNews[];
}
