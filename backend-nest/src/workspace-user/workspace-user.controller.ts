import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { WorkspaceUserService } from './workspace-user.service';
import { AddUserDto, RemoveUserDto } from 'src/workspace/workspace.dto';
import { AllowAddGuard } from 'src/auth-guard/user/allow-add.guard';
import { GeneralGuard } from 'src/auth-guard/general.guard';

@Controller('workspace-user')
export class WorkspaceUserController {
  constructor(private readonly workspaceUserService: WorkspaceUserService) {}

  @Post('add-user')
  @UseGuards(AllowAddGuard)
  async addUser(@Body() details: AddUserDto) {
    return await this.workspaceUserService.addUserToWorkspace(details);
  }

  @Delete('remove-user')
  @UseGuards(AllowAddGuard)
  async removeUser(@Body() details: RemoveUserDto) {
    return await this.workspaceUserService.removeUserFromWorkspace(details);
  }

  @Get('all-users/:workspaceId')
  @UseGuards(GeneralGuard)
  async getAllUsers(@Param('workspaceId') workspaceId: string) {
    return await this.workspaceUserService.getAllUsersOfWorkspace(workspaceId);
  }
}
