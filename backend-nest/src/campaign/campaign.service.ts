import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CreateCampaignDto, UpdateCampaignDto } from './campaign.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Campaign } from './campaign.schema';
import { MessageTemplate } from 'src/message-template/message-template.schema';
import { UserService } from 'src/user/user.service';
import { ContactService } from 'src/contact/contact.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CampaignService {
  constructor(
    @InjectModel(Campaign.name)
    private readonly campaignModel: Model<Campaign>,
    @InjectModel(MessageTemplate.name)
    private readonly messageTemplateModel: Model<MessageTemplate>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => ContactService))
    private readonly contactService: ContactService,
  ) {}

  async create(req: any, createCampaignDto: CreateCampaignDto) {
    const userId = req.user.userId;
    const user: any = await this.userService.userExists(userId);

    if (!user[1]) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const workspaceId = user[0].currentWorkspace;
    if (!workspaceId) {
      throw new HttpException(
        'User does not have a current workspace',
        HttpStatus.BAD_REQUEST,
      );
    }

    const campaignExists = await this.campaignModel.findOne({
      workspaceId: workspaceId,
      name: createCampaignDto.name,
      isDeleted: false,
    });

    if (campaignExists)
      throw new HttpException(
        'Campaign already exists',
        HttpStatus.BAD_REQUEST,
      );

    const template = await this.messageTemplateModel.findOne({
      _id: createCampaignDto.templateId,
      isDeleted: false,
    });

    if (!template || template.isDeleted) {
      throw new HttpException('Invalid template', HttpStatus.UNAUTHORIZED);
    }

    if (template.workspaceId?.toString() !== workspaceId.toString()) {
      throw new HttpException('Invalid template', HttpStatus.UNAUTHORIZED);
    }

    const campaign = new this.campaignModel({
      workspaceId: workspaceId,
      creator: userId,
      lastModifiedBy: userId,
      templateId: createCampaignDto.templateId,
      name: createCampaignDto.name,
      tags: createCampaignDto.tags,
      status: 'Draft',
      startDate: createCampaignDto.startDate,
      endDate: createCampaignDto.endDate,
    });

    await campaign.save();

    return { message: 'Campaign created successfully', campaign };
  }

  async getAllCampaigns() {
    const campaigns = await this.campaignModel.find(
      { isDeleted: false },
      { isDeleted: 0, __v: 0 },
    );

    if (!campaigns)
      throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
    return { message: 'fetched all campaigns', campaigns };
  }

  async delete(campaignId: string) {
    const campaign: any = await this.campaignModel.findById(campaignId);
    if (!campaign) {
      throw new HttpException('Campaign not found', HttpStatus.NOT_FOUND);
    }
    campaign.isDeleted = true;
    await campaign.save();
    return { message: 'Campaign deleted successfully' };
  }

  async update(campaignId: string, updateCampaignDto: UpdateCampaignDto) {
    const campaign = await this.campaignModel.findOneAndUpdate(
      { _id: campaignId, isDeleted: false, status: 'Draft' },
      {
        $set: updateCampaignDto.details,
        tags: updateCampaignDto.tags,
      },
      {
        new: true,
      },
    );

    if (!campaign)
      throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
    return { message: 'campaign updated successfully', campaign };
  }

  async getAllCampaignStatus() {
    const campaignStatus = await this.campaignModel.find(
      { isDeleted: true },
      { status: 1, _id: 1 },
    );
    return campaignStatus;
  }

  async getCampaignById(campaignId: string) {
    const campaign = await this.campaignModel
      .findOne(
        { _id: campaignId, isDeleted: false },
        {
          isDeleted: 0,
          __v: 0,
        },
      )
      .populate('workspaceId', 'name')
      .populate('templateId', 'title')
      .populate('creator', 'name');

    return { message: 'campaign fetched successfully', campaign };
  }

  async getAllCampaignsOfUser(userId: string) {
    const user: any = await this.userService.userExists(userId);

    if (!user[0].currentWorkspace)
      throw new HttpException(
        'User does not have a current workspace',
        HttpStatus.BAD_REQUEST,
      );

    const campaigns = await this.campaignModel.find(
      { creator: userId, isDeleted: false },
      {
        isDeleted: 0,
        __v: 0,
      },
    );

    return { mesage: 'Got all campaigns of user', campaigns };
  }

  async getAllCampaignsOfWorkspace(workspaceId: string) {
    if (!workspaceId)
      throw new HttpException('Not Found', HttpStatus.BAD_REQUEST);

    const campaigns = await this.campaignModel.find(
      { workspaceId, isDeleted: false },
      {
        isDeleted: 0,
        __v: 0,
      },
    );

    if (campaigns.length === 0) return { message: 'no campaigns', campaigns };

    return { message: 'Got all campaigns of workspace', campaigns };
  }

  async getAllContactsByCampaignTag(campaignId: string, userId: string) {
    const campaign: any = await this.campaignModel.findOne(
      { _id: campaignId, isDeleted: false },
      { tags: 1 },
    );

    if (!campaign)
      throw new HttpException('Campaign not found', HttpStatus.NOT_FOUND);

    const contacts = await this.contactService.filterContactByTags(
      campaign.tags,
      userId,
    );

    if (contacts.length === 0)
      throw new HttpException('No contacts found', HttpStatus.NOT_FOUND);

    return { message: 'Got all contacts', contacts };
  }

  async launchCampaign(campaignId: string) {
    const campaign = await this.campaignModel.findOne({
      _id: campaignId,
      isDeleted: false,
    });

    if (!campaign) {
      throw new HttpException('Campaign not found', HttpStatus.NOT_FOUND);
    }

    const now = new Date();

    if (campaign.status === 'Draft' && campaign.startDate <= now) {
      campaign.status = 'Running';
      campaign.startDate = now;
      await campaign.save();
      return { message: 'Campaign launched successfully', campaign };
    } else if (campaign.status === 'Running' && campaign.endDate <= now) {
      campaign.status = 'Completed';
      await campaign.save();
      return { message: 'Campaign completed', campaign };
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateCampaignStatuses() {
    const now = new Date();

    await this.campaignModel.updateMany(
      { status: 'Draft', startDate: { $lte: now } },
      { $set: { status: 'Running' } },
    );

    await this.campaignModel.updateMany(
      { status: 'Running', endDate: { $lte: now } },
      { $set: { status: 'Completed' } },
    );
  }
}
