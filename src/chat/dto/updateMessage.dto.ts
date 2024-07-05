import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateMessageDto {
  @IsNotEmpty()
  @IsNumber()
  message_id: number;

  @IsNotEmpty()
  @IsString()
  message: string;
}
