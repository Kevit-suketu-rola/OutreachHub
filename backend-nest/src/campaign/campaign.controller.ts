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
import { AdminGuard } from 'src/auth-guard/admin/admin.guard';
import { GeneralGuard } from 'src/auth-guard/general.guard';

@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Get('by-id/:campaignId')
  @UseGuards(GeneralGuard)
  async getCampaignById(
    @Param('campaignId') campaignId: string,
    @Req() req: any,
  ) {
    return this.campaignService.getCampaignById(campaignId);
  }

  @Post('create')
  @UseGuards(EditorGuard)
  async create(@Req() req: any, @Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignService.create(req, createCampaignDto);
  }

  @Get('all')
  @UseGuards(AdminGuard)
  async getAll() {
    return this.campaignService.getAllCampaigns();
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

  @Get('all-of-user')
  @UseGuards(UserGuard)
  async getAllCampaignsOfUser(@Req() req: any) {
    return this.campaignService.getAllCampaignsOfUser(req.user.userId);
  }

  @Get('all-of-workspace/:workspaceId')
  @UseGuards(GeneralGuard)
  async getAllCampaignsOfWorkspace(
    @Param('workspaceId') workspaceId: string,
    @Req() req: any,
  ) {
    return this.campaignService.getAllCampaignsOfWorkspace(workspaceId);
  }

  @Get('contacts-by-campaign-tag/:campaignId')
  @UseGuards(UserGuard)
  async getAllContactsByCampaignTag(@Param('campaignId') campaignId: string) {
    return this.campaignService.getAllContactsByCampaignTag(campaignId);
  }

  @Put('launch/:campaignId')
  @UseGuards(EditorGuard)
  async launchCampaign(@Param('campaignId') campaignId: string) {
    return this.campaignService.launchCampaign(campaignId);
  }
}
