import { Field, InputType, Int } from '@nestjs/graphql';
import { CommonListingInputType } from 'src/commonGqlTypes/commonListing.object';

@InputType()
export class ListSchoolInput extends CommonListingInputType {
  @Field({ nullable: true })
  search?: string;

  @Field(() => Int, { nullable: true })
  status?: number;

  @Field({ nullable: true })
  type?: string;
}
