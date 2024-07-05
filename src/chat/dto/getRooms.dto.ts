import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetRoomsDto {
  @IsOptional()
  @IsNumber()
  student_id: number;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsNumber()
  page: number;

  @IsOptional()
  @IsNumber()
  page_size: number;
}
