import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class AddStudentToClass {
  @Field(() => [Int], { nullable: true })
  studentIds: number[];

  @Field(() => ID!)
  class_id: number;
}
