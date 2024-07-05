import { Field, Int, ObjectType } from '@nestjs/graphql';
import { VideoStreaming } from 'src/database/entities/video_streaming.entity';

@ObjectType()
export class ListVideoStreamingObject {
  @Field(() => Int)
  total: number;

  @Field(() => [VideoStreaming])
  videos: VideoStreaming[];
}
