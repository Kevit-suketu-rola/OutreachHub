import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { UserGuard } from 'src/auth-guard/user/user.guard';
import { AllowAddGuard } from 'src/auth-guard/user/allow-add.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('login')
  async login(
    @Body() loginDto: { email: string; password: string },
    @Request() req: any,
  ) {
    return this.userService.loginUser(req, loginDto);
  }

  @Post('logout')
  async logout(@Body() body: { id: string }) {
    return this.userService.logoutUser(body.id);
  }

  @Post('create')
  @UseGuards(AllowAddGuard)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put('update/:id')
  @UseGuards(UserGuard)
  async updateUser(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(req, updateUserDto);
  }

  @Post('set-current-workspace')
  @UseGuards(UserGuard)
  async setCurrentWorkspace(
    @Body('workspaceId') workspaceId: string,
    @Request() req: any,
  ) {
    return this.userService.setCurrentWorkspace(req, workspaceId);
  }
}
