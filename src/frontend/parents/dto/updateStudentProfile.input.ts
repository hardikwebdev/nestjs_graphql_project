import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateStudentInput {
  @Field({ nullable: true })
  firstname?: string;

  @Field({ nullable: true })
  lastname?: string;

  @Field({ nullable: true })
  birthdate?: string;

  @Field({ nullable: true })
  home_address?: string;

  @Field({ nullable: true })
  profile_img?: string;

  @Field({ nullable: true })
  emergency_contact?: string;

  @Field({ nullable: true })
  transition_days?: number;

  @Field({ nullable: true })
  potty_trained?: number;

  @Field({ nullable: true })
  child_care_before: number;

  @Field({ nullable: true })
  is_allergy?: number;

  @Field({ nullable: true })
  allergy_description: string;

  @Field({ nullable: true })
  lunch_program?: number;

  @Field({ nullable: true })
  payment_type?: string;

  @Field({ nullable: true })
  parent_firstname?: string;

  @Field({ nullable: true })
  parent_lastname?: string;
}
