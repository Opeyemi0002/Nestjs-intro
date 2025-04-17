import { IsJSON, IsNotEmpty, IsString } from 'class-validator';
export class createPostMetaOptionsDto {
  @IsNotEmpty()
  @IsJSON()
  metaValue: string;
}
