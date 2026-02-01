import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './infrastructure/persistence/typeorm/entities/user.orm-entity';
import { OAuthAccountOrmEntity } from './infrastructure/persistence/typeorm/entities/oauth-account.orm-entity';
import { EmailVerificationTokenOrmEntity } from './infrastructure/persistence/typeorm/entities/email-verification-token.orm-entity';
import { PasswordResetTokenOrmEntity } from './infrastructure/persistence/typeorm/entities/password-reset-token.orm-entity';
import { RefreshTokenOrmEntity } from './infrastructure/persistence/typeorm/entities/refresh-token.orm-entity';
import { UserTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/user.typeorm-repo';
import { EmailTokenTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/email-token.typeorm-repo';
import { RefreshTokenTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/refresh-token.typeorm-repo';
import { PasswordResetTokenTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/password-reset-token.typeorm-repo';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { EMAIL_TOKEN_REPOSITORY } from './domain/repositories/email-token.repository';
import { REFRESH_TOKEN_REPOSITORY } from './domain/repositories/refresh-token.repository';
import { PASSWORD_RESET_TOKEN_REPOSITORY } from './domain/repositories/password-reset-token.repository';
import { PasswordHasher } from './application/services/password.service';
import { TokenService } from './application/services/token.service';
import { EmailService } from './application/services/email.service';
import { SmsService } from './application/services/sms.service';
import { JwtStrategy } from './infrastructure/jwt/strategies/jwt.strategy';
import { LocalEmailStrategy } from './infrastructure/jwt/strategies/local-email.strategy';
import { LocalPhoneStrategy } from './infrastructure/jwt/strategies/local-phone.strategy';
import { AuthController } from './presentation/auth.controller';
import { ProfileController } from './presentation/profile.controller';
import { IssueRefreshUseCase } from './application/handlers/issue-refresh.usecase';
import { RefreshUseCase } from './application/handlers/refresh.usecase';
import { LogoutUseCase } from './application/handlers/logout.usecase';
import { LogoutAllUseCase } from './application/handlers/logout-all.usecase';
import { RegisterUserUseCase } from './application/handlers/register-user.usecase';
import { LoginEmailUseCase } from './application/handlers/login-email.usecase';
import { LoginPhoneUseCase } from './application/handlers/login-phone.usecase';
import { VerifyEmailUseCase } from './application/handlers/verify-email.usecase';
import { RequestPasswordResetEmailUseCase } from './application/handlers/request-password-reset-email.usecase';
import { RequestPasswordResetPhoneUseCase } from './application/handlers/request-password-reset-phone.usecase';
import { ResetPasswordUseCase } from './application/handlers/reset-password.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserOrmEntity,
      OAuthAccountOrmEntity,
      EmailVerificationTokenOrmEntity,
      PasswordResetTokenOrmEntity,
      RefreshTokenOrmEntity,
    ]),
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
    { provide: PASSWORD_RESET_TOKEN_REPOSITORY, useClass: PasswordResetTokenTypeOrmRepository },
    // services
    PasswordHasher,
    TokenService,
    EmailService,
    SmsService,
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
    RequestPasswordResetEmailUseCase,
    RequestPasswordResetPhoneUseCase,
    ResetPasswordUseCase,
  ],
})
export class AuthModule {}
