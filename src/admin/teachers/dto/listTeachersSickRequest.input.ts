import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { CommonListingInputType } from 'src/commonGqlTypes/commonListing.object';

@InputType()
export class ListTeachersSickRequestInput extends CommonListingInputType {
  @Field({ nullable: true })
  search?: string;

  @Field({ nullable: true })
  start_date?: string;

  @Field({ nullable: true })
  end_date?: string;

  @Field(() => ID, { nullable: true })
  teacherId?: number;

  @Field(() => Int, { nullable: true })
  status?: number;

  @Field(() => String, { nullable: true })
  type?: string;
}
