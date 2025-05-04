import { Transform } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => value ?? 10)
  limit: number;

  @IsOptional()
  @IsPositive()
  @Transform(({ value }) => value ?? 1)
  page: number;
}
