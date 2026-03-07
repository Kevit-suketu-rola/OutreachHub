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
import { WorkspaceService } from './workspace.service';
import { AdminGuard } from 'src/auth-guard/admin/admin.guard';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from './workspace.dto';
import { UserGuard } from 'src/auth-guard/user/user.guard';
import { GeneralGuard } from 'src/auth-guard/general.guard';
import { AllowAddGuard } from 'src/auth-guard/user/allow-add.guard';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get('all-for-admin')
  @UseGuards(AdminGuard)
  async getAllWorkspacesForAdmin() {
    return await this.workspaceService.allWorkspacesForAdmin();
  }

  @Get('all-for-user')
  @UseGuards(UserGuard)
  async getAllWorkspacesForUser(@Req() req: any) {
    return await this.workspaceService.allWorkspacesForUser(req);
  }

  @Get(':id')
  @UseGuards(GeneralGuard)
  async getWorkspaceById(@Param('id') id: string, @Req() req: any) {
    return await this.workspaceService.workspaceById(id, req);
  }

  @Post('create')
  @UseGuards(AdminGuard)
  async createWorkspace(
    @Req() req: any,
    @Body() createWorkspaceDto: CreateWorkspaceDto,
  ) {
    return await this.workspaceService.createWorkspace(req, createWorkspaceDto);
  }

  @Put('update/:id')
  @UseGuards(AdminGuard)
  async updateWorkspace(
    @Req() req: any,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
  ) {
    return await this.workspaceService.editWorkspace(req, updateWorkspaceDto);
  }

  @Delete('delete/:id')
  @UseGuards(AdminGuard)
  async deleteWorkspaceById(@Req() req: any) {
    return await this.workspaceService.deleteWorkspace(req);
  }

  @Post('add-users')
  @UseGuards(AllowAddGuard)
  async addUsersToWorkspace(@Req() req: any, @Body() users: any[]) {
    return await this.workspaceService.addUsersToWorkspace(users, req);
  }

  @Put('add-tags/:workspaceId')
  @UseGuards(AllowAddGuard)
  async addTag(
    @Param('workspaceId') workspaceId: string,
    @Body('tags') tags: string[],
  ) {
    return await this.workspaceService.addTagsToWorkspace(workspaceId, tags);
  }
}
