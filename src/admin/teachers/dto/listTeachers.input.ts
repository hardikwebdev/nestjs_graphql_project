import { Field, InputType, Int, ID } from '@nestjs/graphql';
import { CommonListingInputType } from 'src/commonGqlTypes/commonListing.object';

@InputType()
export class ListTeacherInput extends CommonListingInputType {
  @Field({ nullable: true })
  search?: string;

  @Field({ nullable: true })
  type: string;

  @Field(() => Int, { nullable: true })
  status?: number;

  @Field(() => ID, { nullable: true })
  schoolId: number;
}
