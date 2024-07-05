import { Field, Int, ObjectType } from '@nestjs/graphql';
import { StudentBasicData } from './studentBasicData.object';

@ObjectType()
export class ListStudentsOfClassObjectType {
  @Field(() => Int, { nullable: true })
  total: number;

  @Field(() => [StudentBasicData], { nullable: true })
  students?: StudentBasicData[];
}
