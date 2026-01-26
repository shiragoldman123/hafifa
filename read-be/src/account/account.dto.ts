import { IsString, IsNotEmpty, IsEmail, Length } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  identifier: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 30)
  source: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class UpdateAccountDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
