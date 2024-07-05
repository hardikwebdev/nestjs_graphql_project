import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class UpdateRolePermissionInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  can_add: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  can_update: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  can_delete: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  can_view: number;
}
