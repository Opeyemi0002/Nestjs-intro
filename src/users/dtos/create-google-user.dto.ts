import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GoogleUserDto {
  @IsNotEmpty()
  @IsString()
  googleId: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
