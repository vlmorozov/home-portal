import { Controller, Get, Inject, Logger, NotFoundException, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserRepository, USER_REPOSITORY } from '../../domain/repositories/user-repository';

@ApiTags('profile')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);
  constructor(@Inject(USER_REPOSITORY) private readonly users: UserRepository) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async me(@Req() req: any) {
    const userId = req.user?.userId;
    this.logger.log(`Fetching profile for user ${userId}`);
    const user = userId ? await this.users.findById(userId) : null;
    if (!userId || !user) throw new NotFoundException('USER_NOT_FOUND');
    const profile = {
      userId,
      email: user.email,
      username: user.username,
    };
    this.logger.log(`Profile fetched for user ${userId}`);
    return profile;
  }
}
