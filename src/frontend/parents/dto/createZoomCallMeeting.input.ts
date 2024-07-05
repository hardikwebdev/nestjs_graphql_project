import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { Time_slots } from 'src/admin/teachers/dto/createZoomCallTiming.input';

@InputType()
export class CreateZoomCallMeetingInput {
  @Field(() => String)
  @IsNotEmpty()
  date: string;

  @Field(() => Time_slots)
  time_slots: Time_slots;

  @Field(() => ID, { nullable: true })
  user_id: number;

  @Field(() => ID!)
  student_id: number;

  @Field(() => ID, { nullable: true })
  chat_room_id: number;

  @Field(() => Int, { nullable: true })
  attendee_role: number;
}
