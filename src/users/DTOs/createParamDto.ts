import { IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateParamDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id: number;
}
