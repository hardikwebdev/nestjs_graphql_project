import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteMessageDto {
  @IsNotEmpty()
  @IsNumber()
  message_id: number;

  @IsNotEmpty()
  @IsNumber()
  room_id: number;
}
