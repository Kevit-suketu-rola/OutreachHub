export class CreateContactDto {
  workspaceId: string;
  name: string;
  profilePicture?: string;
  contactInfo: {
    email: string;
    phoneNumber: string;
    countryCode: string;
  };
  company: string;
  jobTitle: string;
  tags: string[];
}

export class UpdateContactDto {
  details: {
    name?: string;
    profilePicture?: string;
    contactInfo?: {
      email?: string;
      phoneNumber?: string;
      countryCode?: string;
    };
    company?: string;
    jobTitle?: string;
  };
  tags: string[];
}
