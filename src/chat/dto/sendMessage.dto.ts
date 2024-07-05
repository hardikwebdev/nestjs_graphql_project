import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SendMessageDto {
  @IsNotEmpty()
  @IsNumber()
  student_id: number;

  @IsNotEmpty()
  @IsNumber()
  receiver_id: number;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  temp_time: string;
}
