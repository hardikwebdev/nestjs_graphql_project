import { Field, InputType } from '@nestjs/graphql';
import { CommonListingInputType } from 'src/commonGqlTypes/commonListing.object';

@InputType()
export class ListClassesOfStudentInput extends CommonListingInputType {
  @Field({ nullable: true })
  search: string;
}
