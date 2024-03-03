import {
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @IsLowercase()
  @Matches(/^[a-z0-9_]+$/, {
    message:
      'username can only contain lowercase letters, numbers, underscores, and can not contain spaces, and symbols',
  })
  username: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[^\s].*[^\s]$/, {
    message: 'Password cannot start and end with whitespace',
  })
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
