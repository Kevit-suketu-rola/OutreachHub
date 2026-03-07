import { IsNotEmpty } from 'class-validator';

export class CreateWorkspaceDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  tags: string[];
}

export class UpdateWorkspaceDto {
  _id?: string;

  name?: string;

  description?: string;

  tags?: string[];
}

export class AddUserDto {
  userId: string;
  workspaceId: string;
  permissions: {
    read?: boolean;
    write: boolean;
    allowAdd: boolean;
  };
}
export class RemoveUserDto {
  userId: string;
  workspaceId: string;
}
