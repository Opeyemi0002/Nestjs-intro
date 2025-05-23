import { Type } from 'class-transformer';
import { postType } from '../enum/postType.enum';
import { postStatus } from '../enum/poststatus.enum';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreatePostMetaOptionsDto } from '../../metaoption/Dtos/createpost.metaoptions.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/DTOs/createUserDto';
import { CreateTagDto } from 'src/tags/Dtos/createtag.dto';
export class CreatePostDto {
  @IsString()
  @MinLength(4)
  @MaxLength(512)
  @IsNotEmpty()
  title: string;

  @IsEnum(postType)
  @IsNotEmpty()
  postType: postType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(56)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'a slug should be only small letter and uses only "-" and without spaces. for example "my-url"',
  })
  slug: string;

  @IsEnum(postStatus)
  @IsNotEmpty()
  status: postStatus;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsJSON()
  @IsOptional()
  schema?: string;

  @IsString()
  @MaxLength(1024)
  @IsOptional()
  @IsUrl()
  featuredImageUrl?: string;

  @IsDate()
  @IsOptional()
  publishedOn?: Date;

  @IsInt({ each: true })
  @IsOptional()
  @IsArray()
  tags?: number[];

  @ApiPropertyOptional({
    required: false,
    items: {
      type: 'object',
      properties: {
        metaValue: {
          type: 'json',
          description: 'the metvalue is a JSON string',
          example: '{"sidenarEnabled":true}',
        },
      },
    },
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto;
  // @ApiProperty({
  //   required: true,
  //   type: 'number',
  //   example: 1,
  // })
  // @IsInt()
  // @IsNotEmpty()
  // authorId: number;
}
