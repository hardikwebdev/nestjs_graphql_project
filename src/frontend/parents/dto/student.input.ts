import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class StudentInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  birthdate: string;

  @Field()
  home_address: string;

  @Field({ nullable: true })
  profile_img?: string;

  @Field()
  emergency_contact: string;

  @Field({ nullable: true })
  transition_days?: number;

  @Field({ nullable: true })
  potty_trained?: number;

  @Field({ nullable: true })
  is_allergy?: number;

  @Field({ nullable: true })
  lunch_program?: number;

  @Field({ nullable: true })
  payment_type?: string;

  @Field({ nullable: true })
  status?: number;

  @Field({ nullable: true })
  allergy_description?: string;

  @Field({ nullable: true })
  child_care_before: number;
}
