import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Classes } from 'src/database/entities/classes.entity';

@ObjectType()
export class ListClassOfStudentObjectType {
  @Field(() => Int, { nullable: true })
  total: number;

  @Field(() => [Classes], { nullable: true })
  classes?: Classes[];
}
