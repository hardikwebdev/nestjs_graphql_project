import { Field, InputType, Int } from '@nestjs/graphql';
import { ArrayNotEmpty, IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateTeacherInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  username: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email: string;

  @Field({ nullable: true })
  phone_number: string;

  @Field({ nullable: true })
  position: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => [Int])
  @ArrayNotEmpty()
  schoolId: number[];
}
