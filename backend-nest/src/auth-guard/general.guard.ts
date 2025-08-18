import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { Token } from './token.schema';
import { UserService } from 'src/user/user.service';
import { AdminService } from 'src/admin/admin.service';
import { log } from 'console';

@Injectable()
export class GeneralGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Token.name) private tokenModel: Model<Token>,
    private adminService: AdminService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) return false;
    const token = authHeader.split(' ')[1];

    if (!token)
      throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);

    const payload = await this.jwtService.verifyAsync(token);

    const isValid: { token: string } | null = await this.tokenModel.findOne(
      {
        token,
      },
      { token: 1, _id: 0 },
    );

    if (!(isValid?.token === token) || (!payload && false))
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);

    request[payload.adminId ? 'admin' : 'user'] = payload;

    const isUser = await this.userService.userExists(payload.userId);

    const isAdmin = await this.adminService.adminExists(payload.adminId);

    return !!(isUser[1] || isAdmin[1]);
  }
}
