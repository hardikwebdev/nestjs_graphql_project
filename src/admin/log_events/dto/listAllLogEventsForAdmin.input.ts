import { Field, ID, InputType } from '@nestjs/graphql';
import { CommonListingInputType } from 'src/commonGqlTypes/commonListing.object';
import { LOG_EVENTS_TYPE } from 'src/constants';

@InputType()
export class ListAllLogEventsForAdminInput extends CommonListingInputType {
  @Field({ nullable: true })
  search?: string;

  @Field({ nullable: true })
  event_type?: LOG_EVENTS_TYPE;

  @Field({ nullable: true })
  date?: Date;

  @Field(() => ID, { nullable: true })
  logeventId?: number;

  @Field({ nullable: true })
  type?: string;
}
