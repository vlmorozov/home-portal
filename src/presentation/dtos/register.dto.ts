import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPhoneNumber, IsString, Length, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'volodymyr' })
  @IsString() @Length(3, 64) username!: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail() email!: string;

  @ApiProperty({ example: '+35799999999', required: false })
  @IsOptional() @IsPhoneNumber() phone?: string;

  @ApiProperty({ minLength: 8 })
  @IsString() @Length(8, 128)
  @Matches(/[A-Z]/, { message: 'password must contain uppercase letter' })
  @Matches(/[a-z]/, { message: 'password must contain lowercase letter' })
  @Matches(/[0-9]/, { message: 'password must contain number' })
  password!: string;
}
