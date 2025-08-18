import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTemplateDto, UpdateTemplateDto } from './message-template.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageTemplate } from './message-template.schema';
import { WorkspaceService } from 'src/workspace/workspace.service';

@Injectable()
export class MessageTemplateService {
  constructor(
    @InjectModel(MessageTemplate.name)
    private readonly messageTemplateModel: Model<MessageTemplate>,
    private readonly workspaceService: WorkspaceService,
  ) {}

  async create(createTemplateDto: CreateTemplateDto) {
    const newTemplate = new this.messageTemplateModel(createTemplateDto);
    await newTemplate.save();

    return { message: 'Template created successfully', template: newTemplate };
  }

  async getTemplateById(id: string) {
    let template = await this.messageTemplateModel.findOne(
      { _id: id, isDeleted: false },
      { isDeleted: 0 },
    );
    if (!template) {
      throw new HttpException('Template not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Template found', template: template };
  }

  async update(id: string, updateTemplateDto: UpdateTemplateDto) {
    const updatedTemplate = await this.messageTemplateModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { $set: updateTemplateDto },
      { new: true },
    );

    if (!updatedTemplate) {
      throw new HttpException('Template not found', HttpStatus.NOT_FOUND);
    }

    return {
      message: 'Template updated successfully',
      template: updatedTemplate,
    };
  }

  async delete(id: string) {
    let template = await this.messageTemplateModel.findById(id);
    if (!template) {
      throw new HttpException('Template not found', HttpStatus.NOT_FOUND);
    }

    template.isDeleted = true;
    await template.save();

    return { message: 'Template deleted successfully' };
  }

  async getAll(workspaceId: string) {
    const isValidWorkspace =
      await this.workspaceService.workspaceExists(workspaceId);
    if (!isValidWorkspace) {
      throw new HttpException('Invalid workspace', HttpStatus.UNAUTHORIZED);
    }

    let templates = await this.messageTemplateModel.find(
      {
        workspaceId: workspaceId,
        isDeleted: false,
      },
      { isDeleted: 0 },
    );

    return { message: 'Templates found', templates: templates };
  }
}
