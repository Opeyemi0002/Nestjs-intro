import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MetaOptionsDto {
  @ApiProperty({
    description: 'A string identifier for the meta option',
    example: 'sideBarEnabled',
  })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({
    description: "Value of any type: 'string', 'number', or 'boolean'",
    example: true,
  })
  @IsNotEmpty()
  value: any;
}
