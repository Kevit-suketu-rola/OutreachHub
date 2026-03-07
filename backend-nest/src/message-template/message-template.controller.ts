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
import { MessageTemplateService } from './message-template.service';
import { CreateTemplateDto, UpdateTemplateDto } from './message-template.dto';
import { EditorGuard } from 'src/auth-guard/user/editor.guard';
import { GeneralGuard } from 'src/auth-guard/general.guard';

@Controller('message-template')
export class MessageTemplateController {
  constructor(
    private readonly messageTemplateService: MessageTemplateService,
  ) {}

  @Post('create')
  @UseGuards(EditorGuard)
  async createMessageTemplate(@Body() createTemplateDto: CreateTemplateDto) {
    return await this.messageTemplateService.create(createTemplateDto);
  }

  @Get(':id')
  @UseGuards(GeneralGuard)
  async getMessageTemplate(@Param('id') id: string) {
    return await this.messageTemplateService.getTemplateById(id);
  }

  @Put('update/:id')
  @UseGuards(EditorGuard)
  async updateMessageTemplate(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto,
  ) {
    return await this.messageTemplateService.update(id, updateTemplateDto);
  }

  @Delete('delete/:id')
  @UseGuards(EditorGuard)
  async deleteMessageTemplate(@Param('id') id: string) {
    return await this.messageTemplateService.delete(id);
  }

  @Get('all/:workspaceId')
  @UseGuards(GeneralGuard)
  async getAllMessageTemplates(@Param('workspaceId') workspaceId: string) {
    return await this.messageTemplateService.getAll(workspaceId);
  }
}
