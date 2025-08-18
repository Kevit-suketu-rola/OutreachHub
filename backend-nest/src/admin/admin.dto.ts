import { IsEmail, IsNotEmpty } from 'class-validator';

export class AdminLoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

class ContactInfo {
  @IsNotEmpty()
  countryCode: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  email: string;
}

export class CreateAdminDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  contactInfo: ContactInfo;
}
