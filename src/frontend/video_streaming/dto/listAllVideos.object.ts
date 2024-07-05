import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { VideoStreamingObject } from 'src/database/entities/video_streaming.entity';

@ObjectType()
export class VideoStreamingObjectType {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => [VideoStreamingObject])
  url_data: VideoStreamingObject[];

  @Field()
  createdAt: Date;

  @Field()
  is_bookmarked: boolean;
}

@ObjectType()
export class ListAllVideosObject {
  @Field(() => Int)
  total: number;

  @Field(() => [VideoStreamingObjectType])
  videos: VideoStreamingObjectType[];
}
