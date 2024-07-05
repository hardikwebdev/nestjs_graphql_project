import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ZoomCallTiming } from 'src/database/entities/zoom_call_timing.entity';

@ObjectType()
export class ListZoomCallTimingObject {
  @Field(() => Int, { nullable: true })
  total?: number;

  @Field(() => [ZoomCallTiming])
  zoomCallTimings: ZoomCallTiming[];
}
