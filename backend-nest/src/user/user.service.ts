import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WorkspaceService } from 'src/workspace/workspace.service';
import { User } from './user.schema';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/auth-guard/token.schema';
import { WorkspaceUserService } from 'src/workspace-user/workspace-user.service';

@Injectable()
export class UserService {
  constructor(
    @Inject(forwardRef(() => WorkspaceService))
    private readonly workspaceService: WorkspaceService,
    @Inject(forwardRef(() => WorkspaceUserService))
    private readonly workspaceUserService: WorkspaceUserService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Token.name) private tokenModel: Model<Token>,
  ) {}

  async loginUser(req: any, loginDto: { email: string; password: string }) {
    try {
      const user = await this.userModel.findOne({
        'contactInfo.email': loginDto.email,
        isDeleted: false,
      });

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      let passwordMatch = bcrypt.compareSync(loginDto.password, user.password);

      if (!passwordMatch) {
        throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
      }

      let alreadyLoggedIn = await this.tokenModel.findOne({
        userId: user._id,
      });

      if (alreadyLoggedIn) {
        return {
          message: 'Already logged in',
        };
      }

      const token = await this.jwtService.signAsync(
        { userId: user._id },
        {
          expiresIn: '1h',
        },
      );

      await this.tokenModel.create({
        token,
        userId: user._id,
      });

      return { message: 'User logged in successfully', token };
    } catch (error) {
      throw new HttpException(
        'Failed to login user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async logoutUser(id: string) {
    const foundUser = await this.userModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!foundUser)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    await this.tokenModel.deleteMany({ userId: foundUser._id });

    return {
      message: 'Logged out successfully',
    };
  }

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({
      'contactInfo.email': createUserDto.contactInfo.email,
      isDeleted: false,
    });

    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = bcrypt.hashSync(createUserDto.password, 10);

    const newUser = new this.userModel({
      name: createUserDto.name,
      password: hashedPassword,
      contactInfo: {
        countryCode: createUserDto.contactInfo.countryCode,
        email: createUserDto.contactInfo.email,
        phoneNumber: createUserDto.contactInfo.phoneNumber,
      },
    });

    await newUser.save();

    return {
      message: 'User created successfully',
      user: { newUser },
    };
  }

  async updateUser(req: any, updateUserDto: UpdateUserDto) {
    const userId = req.user.userId;

    const user = await this.userModel.findOne({
      _id: userId,
      isDeleted: false,
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    await this.userModel.updateOne(
      { _id: userId },
      { $set: { ...updateUserDto } },
    );

    return { message: 'User updated successfully' };
  }

  async deleteUser(userId: string) {
    const user = await this.userExists(userId);

    if (!user[1])
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    await this.userModel.updateOne(
      { _id: userId },
      { $set: { isDeleted: true } },
    );

    const deleted = await this.workspaceUserService.deleteWorkspaceUser(
      userId,
      true,
    );

    if (deleted) return { message: 'User deleted successfully' };

    throw new HttpException('Failed to delete User', HttpStatus.CONFLICT);
  }

  async setCurrentWorkspace(req: any, workspaceId: string) {
    const workspaceExists =
      await this.workspaceService.workspaceExists(workspaceId);

    if (!workspaceExists)
      throw new HttpException('Workspace not found', HttpStatus.NOT_FOUND);

    const updated = await this.userModel.updateOne(
      { _id: req.user.userId },
      { currentWorkspace: workspaceId },
    );

    if (updated.modifiedCount === 1)
      return { message: 'Current workspace set successfully' };

    throw new HttpException(
      'Failed to set current workspace',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  async userExists(userId: string) {
    try {
      const user = await this.userModel.findOne({
        _id: userId,
        isDeleted: false,
      });

      if (!user) {
        return [user, false];
      }

      return [user, true];
    } catch (err) {
      return [null, true];
    }
  }
}
