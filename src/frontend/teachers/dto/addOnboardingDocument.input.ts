import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class AddOnboardingDocumentInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  document_url: string;

  @Field(() => ID)
  @IsNotEmpty()
  document_id: number;
}
