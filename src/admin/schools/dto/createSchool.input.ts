import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { GpsUserInput } from 'src/commonGqlTypes/gpsUser.input';

@InputType()
export class CreateSchoolInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Address is required!' })
  @IsString()
  address: string;

  @Field(() => GpsUserInput)
  school_gps: GpsUserInput;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  parents_radius: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  teachers_radius: number;
}
