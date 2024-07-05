import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class LogoutUserInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String!)
  device_token: string;
}
