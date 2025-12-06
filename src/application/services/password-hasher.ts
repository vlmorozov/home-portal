import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PasswordHasher {
  private readonly logger = new Logger(PasswordHasher.name);

  async hash(plain: string): Promise<string> {
    this.logger.debug('Hashing password');
    const salt = await bcrypt.genSalt(10);
    this.logger.debug(`salt generated`);
    const hashed = await bcrypt.hash(plain, salt);
    this.logger.debug('Password hashed');
    return hashed;
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
