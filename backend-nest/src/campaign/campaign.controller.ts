import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { EditorGuard } from 'src/auth-guard/user/editor.guard';
import { CreateCampaignDto, UpdateCampaignDto } from './campaign.dto';
import { UserGuard } from 'src/auth-guard/user/user.guard';

@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post('create/:workspaceId')
  @UseGuards(EditorGuard)
  async create(@Req() req: any, @Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignService.create(req, createCampaignDto);
  }

  @Delete('delete/:campaignId')
  @UseGuards(EditorGuard)
  async delete(@Param('campaignId') campaignId: string) {
    return this.campaignService.delete(campaignId);
  }

  @Put('update/:campaignId')
  @UseGuards(EditorGuard)
  async update(
    @Param('campaignId') campaignId: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
  ) {
    return this.campaignService.update(campaignId, updateCampaignDto);
  }

  @Get('all-status')
  @UseGuards(UserGuard)
  async getAllStatus() {
    return this.campaignService.getAllCampaignStatus();
  }

  @Get('get/:campaignId')
  @UseGuards(UserGuard)
  async getCampaignById(
    @Param('campaignId') campaignId: string,
    @Req() req: any,
  ) {
    return this.campaignService.getCampaignById(campaignId, req.user.userId);
  }

  @Get('all-of-user')
  @UseGuards(UserGuard)
  async getAllCampaignsOfUser(
    @Param('campaignId') campaignId: string,
    @Req() req: any,
  ) {
    return this.campaignService.getAllCampaignsOfUser(req.user.userId);
  }

  @Get('all-of-workspace')
  @UseGuards(UserGuard)
  async getAllCampaignsOfWorkspace(
    @Param('campaignId') campaignId: string,
    @Req() req: any,
  ) {
    return this.campaignService.getAllCampaignsOfWorkspace(req.user.userId);
  }

  @Get('contacts-by-campaign-tag/:campaignId')
  @UseGuards(UserGuard)
  async getAllContactsByCampaignTag(
    @Param('campaignId') campaignId: string,
    @Req() req: any,
  ) {
    return this.campaignService.getAllContactsByCampaignTag(
      campaignId,
      req.user.userId,
    );
  }
}
