export class CreateCampaignDto {
  templateId: string;
  name: string;
  tags: string[];
  startDate: Date;
  endDate: Date;
}

export class UpdateCampaignDto {
  workspaceId?:string;
  details: {
    templateId?: string;
    name?: string;
    status?: 'Draft' | 'Running' | 'Completed';
    startDate?: Date;
    endDate?: Date;
  };
  tags?: string[];
}
