import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class GpsUserInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  latitude: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  longitude: string;
}
