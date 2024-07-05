import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TotalCountsObject {
  @Field(() => Int)
  schools_total: number;

  @Field(() => Int)
  teachers_total: number;

  @Field(() => Int)
  parents_total: number;

  @Field(() => Int)
  students_total: number;

  @Field(() => Int)
  unassigned_students_school_total: number;

  @Field(() => Int)
  unassigned_students_class_total: number;

  @Field(() => Int)
  sick_request_total: number;

  @Field(() => Int)
  reimbursement_request_total: number;
}
