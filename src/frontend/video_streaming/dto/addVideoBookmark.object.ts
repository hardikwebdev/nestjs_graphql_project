import { Field, ObjectType } from '@nestjs/graphql';
import { VideoStreamingObjectType } from './listAllVideos.object';

@ObjectType()
export class AddVideoBookmarkObject {
  @Field()
  message: string;

  @Field(() => VideoStreamingObjectType)
  videos: VideoStreamingObjectType;
}
