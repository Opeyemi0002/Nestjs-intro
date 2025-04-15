import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostService {
  constructor(private readonly usersService: UsersService) {}

  getPosts(userId: string) {
    try {
      const user = this.usersService.findById(userId);

      return user;
    } catch (err) {}
  }
}
