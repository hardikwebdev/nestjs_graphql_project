import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserType } from 'src/database/entities/announcement.entity';

@InputType()
export class CreateAnnouncementInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  subject: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  message: string;

  @Field()
  @IsNotEmpty()
  publish_date_time: Date;

  @Field()
  @IsNotEmpty()
  send_to: UserType;

  @Field(() => [ID])
  user_Ids?: number[];
}
