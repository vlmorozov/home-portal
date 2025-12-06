import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginPhoneUseCase } from '../../../application/use-cases/login-phone.usecase';

@Injectable()
export class LocalPhoneStrategy extends PassportStrategy(Strategy, 'local-phone') {
  constructor(private readonly usecase: LoginPhoneUseCase) {
    super({ usernameField: 'phone', passwordField: 'password' });
  }
  async validate(phone: string, password: string) {
    try { return await this.usecase.execute({ phone, password }); }
    catch { throw new UnauthorizedException('INVALID_CREDENTIALS'); }
  }
}
