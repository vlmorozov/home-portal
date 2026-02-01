import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty() @IsString() @Length(6, 128) token!: string;
  @ApiProperty() @IsString() @Length(8, 128) newPassword!: string;
}
