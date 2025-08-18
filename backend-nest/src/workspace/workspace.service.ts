import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Workspace } from './workspace.schema';
import mongoose, { Model } from 'mongoose';
import { CreateWorkspaceDto, UpdateWorkspaceDto } from './workspace.dto';
import { WorkspaceUserService } from 'src/workspace-user/workspace-user.service';
import { ContactService } from 'src/contact/contact.service';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectModel(Workspace.name) private workspaceModel: Model<Workspace>,
    private workspaceUserService: WorkspaceUserService,
    private contactService: ContactService,
  ) {}

  async allWorkspacesForAdmin() {
    try {
      console.log('here');

      const workspaces = await this.workspaceModel.find(
        { isDeleted: false },
        { isDeleted: 0 },
      );
      return { message: 'Got all workspaces', workspaces };
    } catch (error) {
      return { error: 'Failed to fetch workspaces for admin' };
    }
  }

  async allWorkspacesForUser(req: any) {
    const userId = req.user.userId;
    try {
      //after userSchema is created, using populate
      return { message: 'Got all workspaces for user' /*, workspaces*/ };
    } catch (err) {
      return { err: 'Failed to fetch workspaces for user' };
    }
  }

  async workspaceById(id: string, req: any) {
    const workspace = await this.workspaceModel.findOne({
      _id: id,
      creator: req.user.userId,
      isDeleted: false,
    });

    console.log(req.user.userId);

    if (!workspace) {
      throw new HttpException('Workspace not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Got workspace', workspace };
  }

  async createWorkspace(req: any, createWorkspaceDto: CreateWorkspaceDto) {
    const { name, description, tags } = createWorkspaceDto;
    try {
      let exists = await this.workspaceModel.findOne({
        name,
        isDeleted: false,
      });

      if (exists) {
        throw new HttpException(
          'Workspace with this name already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      const workspace = new this.workspaceModel({
        creator: req.admin.adminId,
        name,
        description,
        tags,
      });

      await workspace.save();
      return { message: 'Workspace created successfully', workspace };
    } catch (err) {
      return { error: err.message || 'Failed to create workspace' };
    }
  }

  async editWorkspace(req: any, updateData: UpdateWorkspaceDto) {
    try {
      const workspace = await this.workspaceModel.findOne({
        _id: req.params.id,
        creator: req.admin.userId,
        isDeleted: false,
      });

      if (!workspace) {
        throw new HttpException('Workspace not found', HttpStatus.NOT_FOUND);
      }

      Object.assign(workspace, updateData);

      await workspace.save();
      return { message: 'Workspace updated successfully', workspace };
    } catch (err) {
      return { message: 'failed to edit workspace' };
    }
  }

  async deleteWorkspace(req: any) {
    try {
      const workspace = await this.workspaceModel.findOne({
        _id: req.params.id,
        creator: req.admin.adminId,
        isDeleted: false,
      });

      if (!workspace) {
        throw new HttpException('Workspace not found', HttpStatus.NOT_FOUND);
      }

      await this.workspaceUserService.deleteWorkspaceUser(
        workspace._id.toString(),
        false,
      );

      await this.contactService.deleteContactByWorkspaceId(
        workspace._id.toString(),
      );

      workspace.isDeleted = true;

      await workspace.save();
      return { message: 'Workspace deleted successfully' };
    } catch (err) {
      return { message: 'Failed to delete workspace' };
    }
  }

  async addUsersToWorkspace(
    users: {
      userId: string;
      permissions: { write: boolean; allowAdd: boolean };
    }[],
    req: any,
  ) {
    try {
      const workspace = await this.workspaceModel.findOne({
        _id: req.params.id,
        creator: req.admin.userId,
        isDeleted: false,
      });

      if (!workspace) {
        throw new HttpException('Workspace not found', HttpStatus.NOT_FOUND);
      }

      return { message: 'Users added to workspace successfully' };
    } catch (err) {
      return { message: 'Failed to add users to workspace' };
    }
  }

  async addTagsToWorkspace(workspaceId: string, tags: string[]) {
    const isValidWorkspace = await this.workspaceExists(workspaceId);

    if (!isValidWorkspace)
      throw new HttpException('Workspace not found', HttpStatus.NOT_FOUND);

    const updated = await this.workspaceModel.findOneAndUpdate(
      { _id: workspaceId, isDeleted: false },
      { $addToSet: { tags: { $each: tags } } },
      { new: true },
    );

    if (!updated)
      throw new HttpException(
        'Failed to add tags to workspace',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return { message: 'Tags added to workspace successfully', updated };
  }

  async removeTagsFromWorkspace(workspaceId: string, tags: string[]) {
    const isValidWorkspace = await this.workspaceExists(workspaceId);

    if (!isValidWorkspace)
      throw new HttpException('Workspace not found', HttpStatus.NOT_FOUND);

    const updated = await this.workspaceModel.findOneAndUpdate(
      { _id: workspaceId, isDeleted: false },
      { $pull: { tags: { $in: tags } } },
      { new: true },
    );

    if (!updated)
      throw new HttpException(
        'Failed to add tags to workspace',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return { message: 'Tags removed from workspace successfully', updated };
  }

  async workspaceExists(workspaceId: string) {
    try {
      const workspace = await this.workspaceModel.findOne({
        _id: workspaceId,
        isDeleted: false,
      });

      if (!workspace) {
        return [workspace, false];
      }

      return [workspace, true];
    } catch (err) {
      return [null, false];
    }
  }
}
