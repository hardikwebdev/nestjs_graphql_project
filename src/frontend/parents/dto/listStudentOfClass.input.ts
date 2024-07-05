import { InputType, Field } from '@nestjs/graphql';
import { CommonListingInputType } from 'src/commonGqlTypes/commonListing.object';

@InputType()
export class ListStudentOfClassInput extends CommonListingInputType {
  @Field({ nullable: true })
  search: string;
}
