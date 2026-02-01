import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  async sendPasswordReset(phone: string, code: string) {
    // Placeholder for SMS provider integration.
    this.logger.log(`Password reset code sent to ${phone}: ${code}`);
  }
}
