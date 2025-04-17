import { IsNotEmpty, IsString } from 'class-validator';
export class createPostMetaOptionsDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsNotEmpty()
  value: any;
}
