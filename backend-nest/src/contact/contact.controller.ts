import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto, UpdateContactDto } from './contact.dto';
import { EditorGuard } from 'src/auth-guard/user/editor.guard';
import { UserGuard } from 'src/auth-guard/user/user.guard';

@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post('create')
  @UseGuards(EditorGuard)
  async createContact(
    @Req() req: any,
    @Body() createContactDto: CreateContactDto,
  ) {
    return await this.contactService.create(req, createContactDto);
  }

  @Get('get/:id')
  @UseGuards(UserGuard)
  async getById(@Param('id') id: string) {
    return await this.contactService.getContactById(id);
  }

  @Get('workspace/:workspaceId')
  @UseGuards(UserGuard)
  async getByWorkspaceId(@Param('workspaceId') workspaceId: string) {
    return await this.contactService.getContactsByWorkspaceId(workspaceId);
  }

  @Get('creator')
  @UseGuards(UserGuard)
  async ContactsByCreator(@Req() req: any) {
    return await this.contactService.getContactsByCreator(req);
  }

  @Put('update/:id')
  @UseGuards(EditorGuard)
  async updateContact(
    @Param('id') id: string,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    return await this.contactService.update(id, updateContactDto);
  }

  @Delete('delete/:id')
  @UseGuards(EditorGuard)
  async deleteContact(@Param('id') id: string) {
    return await this.contactService.delete(id);
  }

  @Get('filter')
  @UseGuards(UserGuard)
  async filterByTags(@Query('tags') tagsString: string, @Req() req: any) {
    const tags = tagsString.split(',');
    return await this.contactService.filterContactByTags(tags, req.user.userId);
  }
}
