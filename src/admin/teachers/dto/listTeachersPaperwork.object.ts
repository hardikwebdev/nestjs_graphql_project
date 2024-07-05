import { Field, Int, ObjectType } from '@nestjs/graphql';
import { PaperWorks } from 'src/database/entities/paperworks.entity';

@ObjectType()
export class ListTeachersPaperworkObject {
  @Field(() => Int, { nullable: true })
  total?: number;

  @Field(() => [PaperWorks])
  paperworks: PaperWorks[];
}
