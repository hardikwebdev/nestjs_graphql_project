import { Field, InputType } from '@nestjs/graphql';
import { CommonListingInputType } from 'src/commonGqlTypes/commonListing.object';

@InputType()
export class ListRecentLogsInput extends CommonListingInputType {
  @Field({ nullable: true })
  month: string;
}
