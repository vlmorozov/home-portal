import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';
export class LoginEmailDto {
  @ApiProperty() @IsEmail() email!: string;
  @ApiProperty() @IsString() @Length(8, 128) password!: string;
}
