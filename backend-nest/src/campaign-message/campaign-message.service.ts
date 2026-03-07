import { Injectable } from '@nestjs/common';
import { CampaignMessage } from './campaign-message.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CampaignMessageService {
  constructor(
    @InjectModel(CampaignMessage.name)
    private readonly campaignMessageModel: Model<CampaignMessage>,
  ) {}
  async createCampaignMessage(campaignMessage: any[]) {
    return await this.campaignMessageModel.create(campaignMessage);
  }
}
