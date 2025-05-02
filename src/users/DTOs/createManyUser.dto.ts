import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateUserDto } from './createUserDto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateManyUserDto {
  @ApiProperty({
    type: 'array',
    required: true,
    items: { type: 'User' },
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  users: CreateUserDto[];
}
