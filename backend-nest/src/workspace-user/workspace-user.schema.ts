import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Permissions, PermissionsSchema } from 'src/common.schema';
import { User } from 'src/user/user.schema';
import { Workspace } from 'src/workspace/workspace.schema';

@Schema()
export class WorkspaceUser {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Workspace.name })
  workspaceId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: PermissionsSchema })
  permissions: Permissions;

  @Prop({ type: Date, default: Date.now })
  joinedAt: Date;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
}

export const WorkspaceUserSchema = SchemaFactory.createForClass(WorkspaceUser);
