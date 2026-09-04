import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class SignInDto {
  @ApiProperty({
    description: 'input your email address',
    example: 'johndoe@hotmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'input your email address',
    example: 'Password1234_',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
