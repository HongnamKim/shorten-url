import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class PaginateUrlDto {
  @IsIn(['asc', 'ASC', 'DESC', 'desc'])
  @IsOptional()
  order__visits?: 'asc' | 'ASC' | 'DESC' | 'desc' = 'asc';

  @IsNumber()
  @IsOptional()
  take?: number = 20;

  @IsNumber()
  @IsOptional()
  cursorStartId: number;

  @IsNumber()
  @IsOptional()
  cursorStartVisits: number;

  /*@IsNumber()
  @IsOptional()
  where__id__less_than: number;*/
}
