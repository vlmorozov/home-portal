import { Body, Controller, Get, HttpCode, Logger, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginEmailDto } from './dto/login-email.dto';
import { LoginPhoneDto } from './dto/login-phone.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RequestPasswordResetEmailDto } from './dto/request-password-reset-email.dto';
import { RequestPasswordResetPhoneDto } from './dto/request-password-reset-phone.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RegisterUserUseCase } from '../application/handlers/register-user.usecase';
import { LoginEmailUseCase } from '../application/handlers/login-email.usecase';
import { LoginPhoneUseCase } from '../application/handlers/login-phone.usecase';
import { VerifyEmailUseCase } from '../application/handlers/verify-email.usecase';
import { IssueRefreshUseCase } from '../application/handlers/issue-refresh.usecase';
import { RefreshUseCase } from '../application/handlers/refresh.usecase';
import { LogoutUseCase } from '../application/handlers/logout.usecase';
import { LogoutAllUseCase } from '../application/handlers/logout-all.usecase';
import { RequestPasswordResetEmailUseCase } from '../application/handlers/request-password-reset-email.usecase';
import { RequestPasswordResetPhoneUseCase } from '../application/handlers/request-password-reset-phone.usecase';
import { ResetPasswordUseCase } from '../application/handlers/reset-password.usecase';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly registerUC: RegisterUserUseCase,
    private readonly loginEmailUC: LoginEmailUseCase,
    private readonly loginPhoneUC: LoginPhoneUseCase,
    private readonly verifyEmailUC: VerifyEmailUseCase,
    private readonly issueRefreshUC: IssueRefreshUseCase,
    private readonly refreshUC: RefreshUseCase,
    private readonly logoutUC: LogoutUseCase,
    private readonly logoutAllUC: LogoutAllUseCase,
    private readonly requestResetEmailUC: RequestPasswordResetEmailUseCase,
    private readonly requestResetPhoneUC: RequestPasswordResetPhoneUseCase,
    private readonly resetPasswordUC: ResetPasswordUseCase,
  ) {}

  @Post('register') @HttpCode(201)
  async register(@Body() dto: RegisterDto) {
    this.logger.log(`Registering user ${dto.email}`);
    await this.registerUC.execute(dto);
    this.logger.log(`Registration completed for ${dto.email}`);
    return { status: 'ok' };
  }

  @Post('login/email') @HttpCode(200) @ApiBody({ type: LoginEmailDto })
  async loginEmail(@Body() dto: LoginEmailDto) {
    this.logger.log(`Email login requested for ${dto.email}`);
    const { accessToken, userId } = await this.loginEmailUC.execute(dto);
    const refresh = await this.issueRefreshUC.execute(userId);
    this.logger.log(`Email login succeeded for ${dto.email}`);
    return { accessToken, ...refresh };
  }

  @Post('login/phone') @HttpCode(200)
  async loginPhone(@Body() dto: LoginPhoneDto) {
    this.logger.log(`Phone login requested for ${dto.phone}`);
    const { accessToken, userId } = await this.loginPhoneUC.execute(dto);
    const refresh = await this.issueRefreshUC.execute(userId);
    this.logger.log(`Phone login succeeded for ${dto.phone}`);
    return { accessToken, ...refresh };
  }

  @Get('verify-email')
  async verify(@Query() dto: VerifyEmailDto) {
    this.logger.log('Verifying email token');
    await this.verifyEmailUC.execute(dto.token);
    this.logger.log('Email verification completed');
    return { status: 'verified' };
  }

  @Post('refresh') @HttpCode(200) @ApiOkResponse({ description: 'Issues a new access token' })
  async refresh(@Body() dto: RefreshDto) {
    this.logger.log('Refresh token requested');
    return this.refreshUC.execute(dto.refreshToken);
  }

  @Post('logout') @HttpCode(204)
  async logout(@Body() dto: RefreshDto) {
    this.logger.log('Logout requested');
    await this.logoutUC.execute(dto.refreshToken);
    this.logger.log('Logout completed');
    return {};
  }

  @Post('logout-all') @HttpCode(204)
  async logoutAll(@Body() body: { userId: string }) {
    this.logger.log(`Logout all sessions requested for user ${body.userId}`);
    await this.logoutAllUC.execute(body.userId);
    this.logger.log('Logout all sessions completed');
    return {};
  }

  @Post('password/restore/email') @HttpCode(200)
  async requestPasswordResetEmail(@Body() dto: RequestPasswordResetEmailDto) {
    this.logger.log(`Password reset requested by email for ${dto.email}`);
    await this.requestResetEmailUC.execute(dto);
    return { status: 'ok' };
  }

  @Post('password/restore/phone') @HttpCode(200)
  async requestPasswordResetPhone(@Body() dto: RequestPasswordResetPhoneDto) {
    this.logger.log(`Password reset requested by phone for ${dto.phone}`);
    await this.requestResetPhoneUC.execute(dto);
    return { status: 'ok' };
  }

  @Post('password/reset') @HttpCode(200)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    this.logger.log('Password reset confirmation requested');
    await this.resetPasswordUC.execute(dto);
    return { status: 'ok' };
  }
}
