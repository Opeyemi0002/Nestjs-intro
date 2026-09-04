import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class CreateIdDto {
  @ApiPropertyOptional({
    description: 'returns the list of registered users',
    example: 1234,
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  id?: number;
}
