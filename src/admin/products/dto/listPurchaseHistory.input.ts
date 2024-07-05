import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CommonListingInputType } from 'src/commonGqlTypes/commonListing.object';
import { ShippingStatus } from 'src/database/entities/order_details.entity';

@InputType()
export class ListPurchaseHistoryInputType extends CommonListingInputType {
  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  search?: string;

  @IsNumber()
  @IsOptional()
  @Field(() => Int, { nullable: true })
  is_returned?: number;

  @IsNumber()
  @IsOptional()
  @Field(() => Int, { nullable: true })
  is_exchanged?: number;

  @IsOptional()
  @Field({ nullable: true })
  shipping_status?: ShippingStatus;

  @IsOptional()
  @Field({ nullable: true })
  date: string;
}
