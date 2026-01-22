import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
export interface JwtPayload { sub: string; email?: string; }

@Injectable()
export class TokenService {
  constructor(private readonly jwt: JwtService) {}
  access(userId: string, email?: string) {
    return this.jwt.sign({ sub: userId, email });
  }
}
