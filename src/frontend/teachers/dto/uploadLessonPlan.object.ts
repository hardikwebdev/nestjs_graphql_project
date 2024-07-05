import { Field, ObjectType } from '@nestjs/graphql';
import { MessageObject } from 'src/commonGqlTypes/message.object';
import { LessonPlanAttachments } from 'src/database/entities/lesson_plan_attachments.entity';

@ObjectType()
export class UploadOrRemoveLessonPlanObject extends MessageObject {
  @Field(() => LessonPlanAttachments, { nullable: true })
  uploaded_lesson_plan: LessonPlanAttachments;
}
