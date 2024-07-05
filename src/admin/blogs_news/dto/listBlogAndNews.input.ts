import { Field, InputType, Int } from '@nestjs/graphql';
import { CommonListingInputType } from 'src/commonGqlTypes/commonListing.object';

@InputType()
export class ListBlogAndNewsInputType extends CommonListingInputType {
  @Field(() => Int, { nullable: true })
  status?: number;

  @Field(() => String!)
  search?: string;

  @Field(() => String!)
  content_type: string;
}
