import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddUserDto, RemoveUserDto } from 'src/workspace/workspace.dto';
import { WorkspaceUser } from './workspace-user.schema';
import { UserService } from 'src/user/user.service';
import { WorkspaceService } from 'src/workspace/workspace.service';

@Injectable()
export class WorkspaceUserService {
  constructor(
    @InjectModel(WorkspaceUser.name)
    private workspaceUserModel: Model<WorkspaceUser>,
    readonly userService: UserService,
    @Inject(forwardRef(() => WorkspaceService))
    private readonly workspaceService: WorkspaceService,
  ) {}

  async addUserToWorkspace(details: AddUserDto) {
    const userId = details.userId;
    const workspaceId = details.workspaceId;
    const permissions = details.permissions;

    const validUser = await this.userService.userExists(userId);
    const validWorkspace =
      await this.workspaceService.workspaceExists(workspaceId);

    if (!validUser[1] || !validWorkspace[1]) {
      throw new HttpException(
        'Invalid user or workspace',
        HttpStatus.BAD_REQUEST,
      );
    }

    const exists = await this.workspaceUserModel.findOne({
      userId,
      workspaceId,
      isDeleted: false,
    });

    if (exists) {
      throw new HttpException(
        'User already exists in workspace',
        HttpStatus.BAD_REQUEST,
      );
    }

    const workspaceUser = await this.workspaceUserModel.insertOne({
      userId,
      workspaceId,
      permissions,
    });

    return { message: 'User added to workspace successfully', workspaceUser };
  }

  async removeUserFromWorkspace(details: RemoveUserDto) {
    const userId = details.userId;
    const workspaceId = details.workspaceId;

    const isValidUser = await this.userService.userExists(userId);
    const isValidWorkspace =
      await this.workspaceService.workspaceExists(workspaceId);

    if (!isValidUser[1] || !isValidWorkspace[1])
      throw new HttpException(
        'Invalid user or workspace',
        HttpStatus.BAD_REQUEST,
      );

    const workspaceUser = await this.workspaceUserModel.findOneAndUpdate(
      {
        userId,
        workspaceId,
        isDeleted: false,
      },
      { isDeleted: true },
    );

    if (workspaceUser)
      return { message: 'User removed from workspace successfully' };

    throw new HttpException(
      'Failed to remove user from workspace',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  async getAllUsersOfWorkspace(workspaceId: string) {
    const isValidWorkspace =
      await this.workspaceService.workspaceExists(workspaceId);

    if (!isValidWorkspace)
      throw new HttpException(
        'Workspace does not exist',
        HttpStatus.BAD_REQUEST,
      );

    const workspaceUsers = await this.workspaceUserModel
      .find(
        {
          workspaceId,
          isDeleted: false,
        },
        { isDeleted: 0, workspaceId: 0 },
      )
      .populate('userId')
      .exec();

    if (workspaceUsers)
      return { message: 'Got all users of workspace', workspaceUsers };

    throw new HttpException(
      'Failed to get all users of workspace',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  async deleteWorkspaceUser(id: string, userFlag: boolean) {
    try {
      if (userFlag) {
        const deleted = await this.workspaceUserModel.findOneAndUpdate(
          {
            userId: id,
            isDeleted: false,
          },
          { isDeleted: true },
        );
      } else {
        const deleted = await this.workspaceUserModel.findOneAndUpdate(
          {
            workspaceId: id,
            isDeleted: false,
          },
          { isDeleted: true },
        );
      }
      return true;
    } catch (err) {
      return false;
    }
  }

  async getWorkspaceUser(userId: string, workspaceId: string) {
    const workspaceUser = await this.workspaceUserModel.findOne({
      userId,
      workspaceId,
      isDeleted: false,
    });
    return workspaceUser;
  }
}
