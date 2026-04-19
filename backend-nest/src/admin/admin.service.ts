import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Admin } from './admin.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { Token } from 'src/auth-guard/token.schema';
import { AdminLoginDto, CreateAdminDto } from './admin.dto';
import { log } from 'console';

@Injectable()
export class AdminService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(Token.name) private tokenModel: Model<Token>,
  ) {}

  async adminLogin(admin: AdminLoginDto) {
    try {
      const foundAdmin = await this.adminModel.findOne({
        'contactInfo.email': admin.email,
      });

      if (!foundAdmin)
        throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);

      let hashedPass = foundAdmin.password;
      let passwordMatch = bcrypt.compareSync(admin.password, hashedPass);

      if (!passwordMatch)
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);

      await this.tokenModel.deleteMany({ userId: foundAdmin._id });

      const token = await this.jwtService.signAsync(
        {
          adminId: foundAdmin._id,
        },
        {
          expiresIn: '1h',
        },
      );

      await this.tokenModel.create({
        token,
        userId: foundAdmin._id,
      });

      return {
        message: 'Logged in successfully',
        token,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Login failed: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async adminLogout(req: any) {
    try {
      const foundAdmin = await this.adminModel.findById(req.admin.adminId);

      if (!foundAdmin)
        throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);

      await this.tokenModel.deleteMany({ userId: foundAdmin._id });

      return {
        message: 'Logged out successfully',
      };
    } catch (error) {
      return {
        message: 'Logout failed',
      };
    }
  }

  async createAdmin(newAdmin: CreateAdminDto) {
    try {
      const hashedPassword = bcrypt.hashSync(newAdmin.password, 10);
      const admin = new this.adminModel({
        ...newAdmin,
        password: hashedPassword,
        joinDate: new Date(),
      });

      let alreadyExists = await this.adminModel.findOne({
        'contactInfo.email': newAdmin.contactInfo.email,
      });

      if (alreadyExists) {
        throw new HttpException(
          'Admin with this email already exists',
          HttpStatus.CONFLICT,
        );
      }

      await admin.save();

      return {
        message: 'Admin created successfully',
      };
    } catch (error) {
      return { error };
    }
  }
  async adminExists(adminId: string) {
    const admin = await this.adminModel.findOne({
      _id: adminId,
      isDeleted: false,
    });

    if (!admin) {
      return [null, false];
    }

    return [admin, true];
  }
}
