import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from '../DTOs/createUserDto';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashProvider: HashingProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
      if (existingUser) {
        throw new BadRequestException('Error logging in', {
          description: 'Email already exists',
        });
      }
      let newUser = this.userRepository.create({
        ...createUserDto,
        password: await this.hashProvider.hashpassword(createUserDto.password),
      });
      newUser = await this.userRepository.save(newUser);
      return {
        response: 'Success',
        user: newUser,
      };
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      }
      console.error('Unexpected error in createUser:', err);
      throw new InternalServerErrorException('an unexpected error occured');
    }
  }
}
