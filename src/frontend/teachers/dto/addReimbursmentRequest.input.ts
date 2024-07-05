import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { MediaType } from 'src/database/entities/reimbursement_receipt.entity';

@InputType()
export class AddReimbursmentRequest {
  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  description: string;

  @Field()
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  image_url: string;

  @Field()
  type: MediaType;

  @Field(() => ID, { nullable: true })
  teacher_id?: number;
}
