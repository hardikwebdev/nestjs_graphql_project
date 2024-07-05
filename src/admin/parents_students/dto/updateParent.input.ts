import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

@InputType()
export class UpdateStudentInputType {
  @Field(() => ID)
  @IsNotEmpty()
  @IsNumber()
  id: number;

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

  @Field(() => [ID], { nullable: true })
  class_ids?: number[];

  @Field(() => ID, { nullable: true })
  school_id?: number;
}

@InputType()
export class UpdateParentWithStudentsInput {
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

  @Field(() => ID, { nullable: true })
  school_id?: number;

  @Field(() => [UpdateStudentInputType], { nullable: true })
  students: UpdateStudentInputType[];
}
