import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsEnum,
  Length,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export class CreateUserInputDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  lastName: string;

  @IsString()
  @Matches(/^\d{9}$/, { message: 'identityCard must be 9 digits' })
  identityCard: string;

  @Type(() => Date)
  @IsDate()
  birthDate: Date;

  @IsEnum(Gender)
  gender: Gender;
}

export class CreateUserDto extends CreateUserInputDto {
  fullName: string;
}
