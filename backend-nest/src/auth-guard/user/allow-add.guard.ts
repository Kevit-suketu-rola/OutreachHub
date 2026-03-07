import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Token } from '../token.schema';
import { Model } from 'mongoose';
import { WorkspaceUserService } from 'src/workspace-user/workspace-user.service';

@Injectable()
export class AllowAddGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Token.name) private tokenModel: Model<Token>,
    private workspaceUserService: WorkspaceUserService,
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
          userId: payload.userId,
        },
        { token: 1, _id: 0 },
      );

      if (payload.adminId) return true;

      if (!(isValid?.token === token) || !payload)
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);

      const workspaceId =
        request.body.workspaceId || request.params.workspaceId;

      const res = await this.workspaceUserService.getWorkspaceUser(
        payload.userId,
      );

      return !!res?.workspaceUser?.permissions.allowAdd;
    } catch {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
