import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsOptional,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User first name',
    example: 'Joe',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(92)
  firstName: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Joe',
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(92)
  lastName?: string;

  @ApiProperty({
    description: 'Input your email here',
    example: 'Joe@hotmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(92)
  email: string;

  @ApiProperty({
    description:
      'User password. Must contain atleast one uppercase letter, one lowercase letter, and one special character',
    example: 'PAssword!',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one special character',
  })
  password: string;
}
