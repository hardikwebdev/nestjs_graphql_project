import { IsNotEmpty, IsNumber } from 'class-validator';

export class MarkReadDto {
  @IsNotEmpty()
  @IsNumber()
  room_id: number;
}
