import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from '../persistence/entities/user.orm-entity';
import { OAuthAccountOrmEntity } from '../persistence/entities/oauth-account.orm-entity';
import { EmailVerificationTokenOrmEntity } from '../persistence/entities/email-verification-token.orm-entity';
import { RefreshTokenOrmEntity } from '../persistence/entities/refresh-token.orm-entity';
import { UserTypeOrmRepository } from '../persistence/repositories/user.typeorm-repo';
import { EmailTokenTypeOrmRepository } from '../persistence/repositories/email-token.typeorm-repo';
import { RefreshTokenTypeOrmRepository } from '../persistence/repositories/refresh-token.typeorm-repo';
import { USER_REPOSITORY } from '../../domain/repositories/user-repository';
import { EMAIL_TOKEN_REPOSITORY } from '../../domain/repositories/email-token-repository';
import { REFRESH_TOKEN_REPOSITORY } from '../../domain/repositories/refresh-token-repository';
import { PasswordHasher } from '../../application/services/password-hasher';
import { TokenService } from '../../application/services/token.service';
import { EmailService } from '../../application/services/email.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalEmailStrategy } from './strategies/local-email.strategy';
import { LocalPhoneStrategy } from './strategies/local-phone.strategy';
import { AuthController } from '../../presentation/controllers/auth.controller';
import { ProfileController } from '../../presentation/controllers/profile.controller';
import { IssueRefreshUseCase } from '../../application/use-cases/issue-refresh.usecase';
import { RefreshUseCase } from '../../application/use-cases/refresh.usecase';
import { LogoutUseCase } from '../../application/use-cases/logout.usecase';
import { LogoutAllUseCase } from '../../application/use-cases/logout-all.usecase';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.usecase';
import { LoginEmailUseCase } from '../../application/use-cases/login-email.usecase';
import { LoginPhoneUseCase } from '../../application/use-cases/login-phone.usecase';
import { VerifyEmailUseCase } from '../../application/use-cases/verify-email.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity, OAuthAccountOrmEntity, EmailVerificationTokenOrmEntity, RefreshTokenOrmEntity]),
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get('jwt.secret'),
        signOptions: { expiresIn: cfg.get('jwt.expiresIn'), issuer: cfg.get('jwt.issuer') },
      }),
    }),
  ],
  controllers: [AuthController, ProfileController],
  providers: [
    // repos
    { provide: USER_REPOSITORY, useClass: UserTypeOrmRepository },
    { provide: EMAIL_TOKEN_REPOSITORY, useClass: EmailTokenTypeOrmRepository },
    { provide: REFRESH_TOKEN_REPOSITORY, useClass: RefreshTokenTypeOrmRepository },
    // services
    PasswordHasher,
    TokenService,
    EmailService,
    // strategies
    JwtStrategy,
    LocalEmailStrategy,
    LocalPhoneStrategy,
    // usecases
    IssueRefreshUseCase,
    RefreshUseCase,
    LogoutUseCase,
    LogoutAllUseCase,
    RegisterUserUseCase,
    LoginEmailUseCase,
    LoginPhoneUseCase,
    VerifyEmailUseCase,
  ],
})
export class AuthModule {}
