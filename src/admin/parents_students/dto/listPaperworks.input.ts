import { Field, ID, InputType } from '@nestjs/graphql';
import { CommonListingInputType } from 'src/commonGqlTypes/commonListing.object';

@InputType()
export class ListParentsPaperworkInput extends CommonListingInputType {
  @Field({ nullable: true })
  search?: string;

  @Field(() => ID, { nullable: true })
  parent_id?: number;
}
