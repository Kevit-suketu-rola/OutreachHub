import { Controller } from '@nestjs/common';
import { CampaignMessageService } from './campaign-message.service';

@Controller('campaign-message')
export class CampaignMessageController {

  constructor(
    private readonly campaignMessageService: CampaignMessageService,
  ) {}

}
