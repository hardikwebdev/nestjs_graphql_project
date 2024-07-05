import { Field, ID, InputType } from '@nestjs/graphql';
import { CommonListingInputType } from 'src/commonGqlTypes/commonListing.object';

@InputType()
export class ListTeachersPaperworkInput extends CommonListingInputType {
  @Field({ nullable: true })
  search?: string;

  @Field(() => ID, { nullable: true })
  teacherId?: number;
}
