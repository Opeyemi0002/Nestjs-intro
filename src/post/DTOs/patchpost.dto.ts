import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './createPost.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class PatchPostDto extends PartialType(CreatePostDto) {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'the ID of the post that need to be updated',
  })
  id: number;
}
