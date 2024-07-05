import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Announcement } from 'src/database/entities/announcement.entity';

@ObjectType()
export class ListAnnouncementObject {
  @Field(() => Int, { nullable: true })
  total: number;

  @Field(() => [Announcement])
  announcements: Announcement[];
}
