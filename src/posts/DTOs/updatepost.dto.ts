import { PartialType, OmitType } from '@nestjs/swagger';
import { CreatePostDto } from './post.dto';

export class UpdatePostDto extends PartialType(
  OmitType(CreatePostDto, ['title'] as const),
) {}
