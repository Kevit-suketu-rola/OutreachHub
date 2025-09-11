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
import { Token } from '../token.schema';
import { Model } from 'mongoose';
import { WorkspaceUserService } from 'src/workspace-user/workspace-user.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class EditorGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Token.name) private tokenModel: Model<Token>,
    private workspaceUserService: WorkspaceUserService,
    private readonly userService: UserService,
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
        userId: payload.userId,
      },
      { token: 1, _id: 0 },
    );

    if (!(isValid?.token === token) || !payload)
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);

    if (payload.adminId) return true;

    const user = await this.userService.userExists(payload.userId);

    const workspaceId =
      request.params?.workspaceId ||
      request.body?.workspaceId ||
      user[0]?.currentWorkspace;

    const res = await this.workspaceUserService.getWorkspaceUser(
      payload.userId,
    );
    request['user'] = payload;

    return !!res?.workspaceUser?.permissions.write;
  }
}
