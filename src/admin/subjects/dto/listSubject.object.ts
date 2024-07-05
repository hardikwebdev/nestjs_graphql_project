import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Subjects } from 'src/database/entities/subject.entity';

@ObjectType()
export class ListSubjectObjectType {
  @Field(() => Int, { nullable: true })
  total: number;

  @Field(() => [Subjects], { nullable: true })
  subjects: Subjects[];
}
