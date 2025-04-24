import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './DTOs/createUserDto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
      if (existingUser) {
        return 'error';
      }
      let newUser = await this.userRepository.create(createUserDto);
      newUser = await this.userRepository.save(newUser);
      return {
        response: 'Success',
        user: newUser,
      };
    } catch (err) {}
  }

  async findById(id: number) {
    return await this.userRepository.findOneBy({ id });
  }
}
