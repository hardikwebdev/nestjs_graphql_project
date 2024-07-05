import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class GetRoomMessagesDto {
  @IsNotEmpty()
  @IsNumber()
  room_id: number;

  @IsOptional()
  @IsNumber()
  page: number = 1;

  @IsOptional()
  @IsNumber()
  page_size: number = 10;
}
