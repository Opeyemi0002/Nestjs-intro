import { Injectable } from '@nestjs/common';
import { HashService } from './hash.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService implements HashService {
  async hashPassword(data: string | Buffer): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data, salt);
    return hashedPassword;
  }

  async comparePassword(
    data: string | Buffer,
    encrypted: string,
  ): Promise<boolean> {
    const comparePassword = await bcrypt.compare(data, encrypted);
    return comparePassword;
  }
}
