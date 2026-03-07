import { forwardRef, Module } from '@nestjs/common';
import { WorkspaceUserService } from './workspace-user.service';
import { WorkspaceUserController } from './workspace-user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkspaceUser, WorkspaceUserSchema } from './workspace-user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WorkspaceModule } from 'src/workspace/workspace.module';
import { UserModule } from 'src/user/user.module';
import { Token, TokenSchema } from 'src/auth-guard/token.schema';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WorkspaceUser.name, schema: WorkspaceUserSchema },
      { name: Token.name, schema: TokenSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    forwardRef(() => WorkspaceModule),
    forwardRef(() => UserModule),
    forwardRef(() => AdminModule),
  ],
  providers: [WorkspaceUserService],
  controllers: [WorkspaceUserController],
  exports: [WorkspaceUserService],
})
export class WorkspaceUserModule {}
