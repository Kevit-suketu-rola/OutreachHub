export class CreateUserDto {
  name: string;
  password: string;
  contactInfo: {
    countryCode: string;
    email: string;
    phoneNumber: number;
  };
}

export class UpdateUserDto {
  name?: string;
  contactInfo?: {
    countryCode?: string;
    email?: string;
    phoneNumber?: number;
  };
}
