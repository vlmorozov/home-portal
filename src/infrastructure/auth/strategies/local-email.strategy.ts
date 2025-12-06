import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginEmailUseCase } from '../../../application/use-cases/login-email.usecase';

@Injectable()
export class LocalEmailStrategy extends PassportStrategy(Strategy, 'local-email') {
  constructor(private readonly usecase: LoginEmailUseCase) {
    super({ usernameField: 'email', passwordField: 'password' });
  }
  async validate(email: string, password: string) {
    try { return await this.usecase.execute({ email, password }); }
    catch { throw new UnauthorizedException('INVALID_CREDENTIALS'); }
  }
}
