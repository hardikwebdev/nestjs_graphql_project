import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class ForgetPasswordInput {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @Field()
  email: string;
}
