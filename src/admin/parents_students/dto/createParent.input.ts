import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class StudentInputType {
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
  @IsString()
  birthdate: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  home_address: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  emergency_contact: string;

  @Field(() => Int, { nullable: true })
  transition_days?: number;

  @Field(() => Int, { nullable: true })
  potty_trained?: number;

  @Field(() => Int, { nullable: true })
  is_allergy?: number;

  @Field(() => Int, { nullable: true })
  lunch_program?: number;

  @Field({ nullable: true })
  payment_type?: string;

  @Field({ nullable: true })
  allergy_description?: string;

  @Field(() => Int, { nullable: true })
  child_care_before: number;

  @Field(() => ID, { nullable: true })
  school_id?: number;
}

@InputType()
export class CreateParentInput {
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

  @Field(() => ID, { nullable: true })
  school_id?: number;

  @Field(() => [StudentInputType], { nullable: true })
  students: StudentInputType[];
}
