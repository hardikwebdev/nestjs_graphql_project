import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SendGroupMessageDto {
  @IsNotEmpty()
  @IsNumber()
  room_id: number;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  temp_time: string;
}
