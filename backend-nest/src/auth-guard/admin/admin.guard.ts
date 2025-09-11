import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Token } from '../token.schema';
import { Model } from 'mongoose';
import { AdminService } from 'src/admin/admin.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => AdminService))
    private adminService: AdminService,
    @InjectModel(Token.name) private tokenModel: Model<Token>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) return false;

    const token = authHeader.split(' ')[1];

    if (!token)
      throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);

    try {
      const payload = await this.jwtService.verifyAsync(token);

      const isValid: { token: string } | null = await this.tokenModel.findOne(
        {
          userId: payload.adminId,
        },
        { token: 1, _id: 0 },
      );

      if (!(isValid?.token === token) || !payload)
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);

      request['admin'] = payload;
      const isAdmin = await this.adminService.adminExists(payload.adminId);


      return true;
    } catch {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
