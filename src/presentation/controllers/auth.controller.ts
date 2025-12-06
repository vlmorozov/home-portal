import { Body, Controller, Get, HttpCode, Logger, Post, Query } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from '../dtos/register.dto';
import { LoginEmailDto } from '../dtos/login-email.dto';
import { LoginPhoneDto } from '../dtos/login-phone.dto';
import { VerifyEmailDto } from '../dtos/verify-email.dto';
import { RefreshDto } from '../dtos/refresh.dto';
import { RegisterUserUseCase } from '../../application/use-cases/register-user.usecase';
import { LoginEmailUseCase } from '../../application/use-cases/login-email.usecase';
import { LoginPhoneUseCase } from '../../application/use-cases/login-phone.usecase';
import { VerifyEmailUseCase } from '../../application/use-cases/verify-email.usecase';
import { IssueRefreshUseCase } from '../../application/use-cases/issue-refresh.usecase';
import { RefreshUseCase } from '../../application/use-cases/refresh.usecase';
import { LogoutUseCase } from '../../application/use-cases/logout.usecase';
import { LogoutAllUseCase } from '../../application/use-cases/logout-all.usecase';

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
}
