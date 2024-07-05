import { Field, ID, InputType } from '@nestjs/graphql';
import { CommonListingInputType } from 'src/commonGqlTypes/commonListing.object';

@InputType()
export class ListZoomCallTimingInput extends CommonListingInputType {
  @Field({ nullable: true })
  type?: string;

  @Field(() => ID, { nullable: true })
  zoomCallTimingID?: number;

  @Field(() => ID, { nullable: true })
  teacherID?: number;

  @Field(() => Date, { nullable: true })
  date: Date;
}
