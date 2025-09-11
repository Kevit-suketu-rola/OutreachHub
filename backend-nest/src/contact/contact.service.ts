import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Contact } from './contact.schema';
import mongoose, { Model } from 'mongoose';
import { CreateContactDto, UpdateContactDto } from './contact.dto';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
    @Inject(forwardRef(() => WorkspaceService))
    private readonly workspaceService: WorkspaceService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async create(req: any, createContactDto: CreateContactDto) {
    const isValidWorkspace = await this.workspaceService.workspaceExists(
      createContactDto.workspaceId,
    );

    if (!isValidWorkspace[1])
      throw new HttpException('Invalid workspace', HttpStatus.BAD_REQUEST);

    const contactExists = await this.getContactByEmail(
      createContactDto.contactInfo.email,
    );

    if (contactExists)
      throw new HttpException('Contact already exists', HttpStatus.BAD_REQUEST);

    const createdContact = new this.contactModel({
      ...createContactDto,
      creator: req.user.userId,
      isDeleted: false,
    });

    await createdContact.save();

    return { message: 'Contact created successfully', contact: createdContact };
  }

  async getAllContacts() {
    const contacts = await this.contactModel.find({
      isDeleted: false,
    });
    if (!contacts) {
      throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'fetched all contact', contacts };
  }

  async getContactById(id: string) {
    const contact = await this.contactModel.findOne({
      _id: id,
      isDeleted: false,
    });
    if (!contact) {
      throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'fetched contact', contact };
  }

  async getContactsByWorkspaceId(workspaceId: string) {
    const isValidWorkspace =
      await this.workspaceService.workspaceExists(workspaceId);

    if (!isValidWorkspace[1])
      throw new HttpException('Invalid workspace', HttpStatus.BAD_REQUEST);

    const contacts = await this.contactModel.find({
      workspaceId,
      isDeleted: false,
    });
    if (!contacts) {
      throw new HttpException('No contacts found', HttpStatus.NOT_FOUND);
    }
    return { message: 'fetched contacts of workspace', contacts };
  }

  async getContactsByCreator(req: any) {
    const contacts = await this.contactModel.find({
      creator: req.user.userId,
      isDeleted: false,
    });

    if (!contacts)
      throw new HttpException('No contacts found', HttpStatus.NOT_FOUND);

    return contacts;
  }

  async update(id: string, updateContactDto: UpdateContactDto) {
    const contact = await this.contactModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      {
        $set: {
          ...updateContactDto.details,
          tags: updateContactDto.tags,
        },
      },
      {
        new: true,
      },
    );

    if (!contact)
      throw new HttpException('Contact not found', HttpStatus.NOT_FOUND);

    return { message: 'contact updated successfully', contact };
  }

  async delete(id: string) {
    const contact: any = await this.contactModel.updateOne(
      { _id: id },
      {
        isDeleted: true,
      },
    );

    if (contact.modifiedCount === 0)
      throw new HttpException('Nothing Deleted', HttpStatus.NOT_FOUND);

    return { message: 'Contact deleted successfully' };
  }

  async deleteContactByWorkspaceId(id: string) {
    const contact = await this.contactModel.updateMany(
      { workspaceId: id },
      {
        isDeleted: true,
      },
    );
  }

  async filterContactByTags(tags: string[], userId: string) {
    const user: any = await this.userService.userExists(userId);

    if (!user[1])
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);

    const workspaceId = new mongoose.Types.ObjectId(user[0].currentWorkspace);

    const contacts = await this.contactModel.find(
      {
        workspaceId: workspaceId,
        tags: { $in: tags },
        isDeleted: false,
      },
      { isDeleted: false },
    );

    return contacts;
  }

  async getContactByEmail(email: string) {
    return this.contactModel.findOne({
      'contactInfo.email': email,
      isDeleted: false,
    });
  }
}
