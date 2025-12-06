import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository, USER_REPOSITORY } from '../../../domain/repositories/user-repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(cfg: ConfigService, @Inject(USER_REPOSITORY) private readonly users: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: cfg.getOrThrow<string>('jwt.secret'),
      issuer: cfg.get<string>('jwt.issuer'),
    });
  }
  async validate(payload: any) {
    const user = await this.users.findById(payload.sub);
    return { userId: payload.sub, email: payload.email, username: user?.username ?? null };
  }
}
