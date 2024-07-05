import { Field, ID, InputType } from '@nestjs/graphql';
import { CommonListingInputType } from 'src/commonGqlTypes/commonListing.object';

@InputType()
export class ListLogEventsInput extends CommonListingInputType {
  @Field({ nullable: true })
  search?: string;

  @Field(() => ID, { nullable: true })
  event_type_id: number;

  @Field({ nullable: true })
  month: string;

  @Field(() => ID, { nullable: true })
  student_id: number;
}
