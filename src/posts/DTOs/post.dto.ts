import {
  IsArray,
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
import { postType } from '../enum/posttype.enum';
import { postStatus } from '../enum/poststatus.enum';
import { Type } from 'class-transformer';
import { MetaOptionsDto } from '../../metaoption/DTOs/metaoptions.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'this is the title of the blogpost',
    example: 'NestJs Introduction',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(90)
  title: string;

  @ApiPropertyOptional({
    description: 'this is the content of the blogpost',
    example: 'post content',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description:
      "this the post properties and the posible values are 'post', 'page', 'story', 'series'",
    enum: postType,
    default: postType.SERIES,
  })
  @IsEnum(postType)
  @IsNotEmpty()
  postType: postType;

  @ApiProperty({
    description:
      "this is the state of the post, it could be 'draft', 'review','post', 'publish'",
    enum: postStatus,
  })
  @IsEnum(postStatus)
  @IsNotEmpty()
  postStatus: postStatus;

  @ApiPropertyOptional({
    description: 'provides an easy to read statement separated by an hyphen',
    example: 'introduction-to-nestjs',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(90)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'a slug should be all letters and uses only "-" and without spaces.for example "my-url"',
  })
  slug: string;

  @ApiPropertyOptional({
    description:
      'serialize your JSON object otherwise a validation error will be thrown',
    example: '\r\n @complex"',
  })
  @IsString()
  @IsOptional()
  @IsJSON()
  schema?: string;

  @ApiPropertyOptional({
    description: 'this is the asscioted picture to the blogpost',
    example: 'wwww.featuredImage.com/pictures.jpeg',
  })
  @IsOptional()
  @IsUrl()
  featuredImage?: string;

  @ApiPropertyOptional({
    description: 'This is the publish date of the blogpost',
    example: '2024-03-16T07:46:32+0000',
  })
  @IsISO8601()
  publishedOn: Date;

  @ApiPropertyOptional({
    description: 'This is an array of tags related to the blogpost',
    example: "['nestjs', 'typescript', 'javascript']",
  })
  @IsInt({ each: true })
  @IsOptional()
  @IsArray()
  @MinLength(3, { each: true })
  tags?: number[];

  @ApiPropertyOptional({
    description: 'this is an array of metaoptions in the blogpost ',
    type: MetaOptionsDto,
  })
  @Type(() => MetaOptionsDto)
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  metaOptions?: MetaOptionsDto[];
}
