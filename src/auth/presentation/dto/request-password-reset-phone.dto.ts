import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber } from 'class-validator';

export class RequestPasswordResetPhoneDto {
  @ApiProperty() @IsPhoneNumber() phone!: string;
}
