export class CreateTemplateDto {
  workspaceId: string;
  title: string;
  type: 'text' | 'text-image';
  templateImage?: string;
  template: string;
}

export class UpdateTemplateDto {
  title?: string;
  type?: 'text' | 'text-image';
  templateImage?: string;
  template?: string;
}
