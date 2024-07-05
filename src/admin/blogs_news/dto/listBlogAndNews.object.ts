import { Field, Int, ObjectType } from '@nestjs/graphql';
import { BlogsAndNews } from 'src/database/entities/blogs_news.entity';

@ObjectType()
export class ListBlogAndNewsObjectType {
  @Field(() => Int, { nullable: true })
  total?: number;

  @Field(() => [BlogsAndNews], { nullable: true })
  blogsOrNews?: BlogsAndNews[];
}
