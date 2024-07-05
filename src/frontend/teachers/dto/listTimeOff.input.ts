import { Field, InputType } from '@nestjs/graphql';
import { CommonListingInputType } from 'src/commonGqlTypes/commonListing.object';
import { RequestType } from 'src/constants';

@InputType()
export class ListTimeOffRequestInput extends CommonListingInputType {
  @Field(() => String, { nullable: true })
  search?: string;

  @Field({ nullable: true })
  date?: string;

  @Field({ nullable: true })
  type?: RequestType;

  @Field({ nullable: true })
  status?: number;
}
