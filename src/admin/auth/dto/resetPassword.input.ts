import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class ResetPasswordInput {
  @IsString()
  @IsNotEmpty()
  @Field()
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  resetToken: string;
}
