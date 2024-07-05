import { Field, InputType } from '@nestjs/graphql';
import { CommonListingInputType } from 'src/commonGqlTypes/commonListing.object';

@InputType()
export class ListClassInputType extends CommonListingInputType {
  @Field(() => String, { nullable: true })
  search?: string;
}
