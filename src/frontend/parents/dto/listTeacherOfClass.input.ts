import { InputType, Field } from '@nestjs/graphql';
import { CommonListingInputType } from 'src/commonGqlTypes/commonListing.object';

@InputType()
export class ListTeacherOfClassInput extends CommonListingInputType {
  @Field({ nullable: true })
  search: string;
}
