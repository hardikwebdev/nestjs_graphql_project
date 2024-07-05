import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Schools } from 'src/database/entities/schools.entity';

@ObjectType()
export class ListSchoolsObjectType {
  @Field(() => Int, { nullable: true })
  total?: number;

  @Field(() => [Schools])
  schools: Schools[];
}
