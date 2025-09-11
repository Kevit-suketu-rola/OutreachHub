export class CreateUserDto {
  name: string;
  password: string;
  contactInfo: {
    countryCode: string;
    email: string;
    phoneNumber: number;
  };
  workspaceId?: string;
  permissions?: {
    read: boolean;
    write: boolean;
    allowAdd: boolean;
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
