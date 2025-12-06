import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString, Length } from 'class-validator';
export class LoginPhoneDto {
  @ApiProperty() @IsPhoneNumber() phone!: string;
  @ApiProperty() @IsString() @Length(8, 128) password!: string;
}
