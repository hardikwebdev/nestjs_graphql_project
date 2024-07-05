import { Field, InputType, Int } from '@nestjs/graphql';
import { ArrayNotEmpty, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class UpdateTeacherInput {
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
