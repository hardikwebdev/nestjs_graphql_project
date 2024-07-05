import { Field, InputType } from '@nestjs/graphql';
import { CommonListingInputType } from 'src/commonGqlTypes/commonListing.object';

@InputType()
export class ListAllLogEventsForParentInput extends CommonListingInputType {
  @Field({ nullable: true })
  month: string;

  @Field({ nullable: true })
  search: string;
}
