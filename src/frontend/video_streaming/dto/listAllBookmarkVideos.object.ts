import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserVideoBookmarks } from 'src/database/entities/user_video_bookmark.entity';

@ObjectType()
export class ListAllBookmarkVideosObject {
  @Field(() => Int)
  total: number;

  @Field(() => [UserVideoBookmarks])
  videos: UserVideoBookmarks[];
}
