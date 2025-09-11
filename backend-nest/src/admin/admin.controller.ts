import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard } from 'src/auth-guard/admin/admin.guard';
import { AdminLoginDto, CreateAdminDto } from './admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  async adminLogin(@Body() admin: AdminLoginDto) {
    return this.adminService.adminLogin(admin);
  }

  @Post('logout')
  @UseGuards(AdminGuard)
  async adminLogout(@Req() req: Request) {
    return this.adminService.adminLogout(req);
  }

  @Post('create-admin')
  @UseGuards(AdminGuard)
  async createAdmin(@Body() newadmin: CreateAdminDto) {
    return this.adminService.createAdmin(newadmin);
  }
}
