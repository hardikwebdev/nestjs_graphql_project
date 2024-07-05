import { Field, InputType, Int } from '@nestjs/graphql';
import { CommonListingInputType } from 'src/commonGqlTypes/commonListing.object';

@InputType()
export class ListReimbursmentRequest extends CommonListingInputType {
  @Field(() => String, { nullable: true })
  search?: string;

  @Field({ nullable: true })
  date?: string;

  @Field(() => Int, { nullable: true })
  status?: number;
}
