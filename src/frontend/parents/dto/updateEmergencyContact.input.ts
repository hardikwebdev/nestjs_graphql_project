import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateEmergencyContactInput {
  @Field({ nullable: true })
  emergency_contact?: string;
}
